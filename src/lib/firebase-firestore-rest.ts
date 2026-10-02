type FirestoreData = Record<string, unknown>;
type FilterOperator = "==" | "<=";
type FirestoreValue =
  | { nullValue: "NULL_VALUE" }
  | { booleanValue: boolean }
  | { integerValue: string }
  | { doubleValue: number }
  | { stringValue: string }
  | { timestampValue: string }
  | { arrayValue: { values: FirestoreValue[] } }
  | { mapValue: { fields: Record<string, FirestoreValue> } };

type QueryFilter = {
  fieldPath: string;
  operator: FilterOperator;
  value: unknown;
};
type QueryOrder = { fieldPath: string; direction: "asc" | "desc" };

type FirestoreDocument = {
  name: string;
  fields?: Record<string, FirestoreValue>;
};

type FirestoreDocumentSnapshot = {
  found?: FirestoreDocument;
  missing?: string;
};

type FirestoreWrite =
  | {
      update: FirestoreDocument;
      updateMask?: { fieldPaths: string[] };
      currentDocument?: { exists: false };
    }
  | { delete: string };

type AccessTokenProvider = () => Promise<string>;

export class FirestoreRestError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code?: string,
  ) {
    super(message);
    this.name = "FirestoreRestError";
  }
}

export class FirestoreRestClient {
  private readonly documentsUrl: string;
  private readonly documentResourcePath: string;

  constructor(
    projectId: string,
    private readonly getAccessToken: AccessTokenProvider,
  ) {
    this.documentResourcePath = `projects/${projectId}/databases/(default)/documents`;
    this.documentsUrl = `https://firestore.googleapis.com/v1/${this.documentResourcePath}`;
  }

  collection(name: string) {
    return new FirestoreRestCollection(this, name);
  }

  async runTransaction<T>(
    callback: (transaction: FirestoreRestTransaction) => Promise<T>,
  ): Promise<T> {
    for (let attempt = 0; ; attempt += 1) {
      const transactionId = await this.beginTransaction();
      const transaction = new FirestoreRestTransaction(this, transactionId);
      try {
        const result = await callback(transaction);
        await this.commit(transactionId, transaction.writes);
        return result;
      } catch (error) {
        try {
          await this.rollback(transactionId);
        } catch (rollbackError) {
          console.error("Firestore REST transaction rollback failed:", rollbackError);
        }
        if (
          error instanceof FirestoreRestError &&
          error.code === "ABORTED" &&
          attempt < 4
        ) {
          continue;
        }
        throw error;
      }
    }
  }

  async getDocument(
    path: string,
    transactionId?: string,
  ): Promise<FirestoreRestDocumentSnapshot> {
    if (!transactionId) {
      try {
        const document = await this.request<FirestoreDocument>(
          `${this.documentsUrl}/${path}`,
        );
        return new FirestoreRestDocumentSnapshot(this, path, document);
      } catch (error) {
        if (error instanceof FirestoreRestError && error.status === 404) {
          return new FirestoreRestDocumentSnapshot(this, path);
        }
        throw error;
      }
    }

    const response = await this.request<FirestoreDocumentSnapshot[]>(
      `${this.documentsUrl}:batchGet`,
      {
        method: "POST",
        body: JSON.stringify({
          documents: [`${this.documentsUrl}/${path}`],
          transaction: transactionId,
        }),
      },
    );
    const result = response[0];
    return new FirestoreRestDocumentSnapshot(this, path, result?.found);
  }

  async getQuery(
    collection: string,
    filters: QueryFilter[],
    limit: number | undefined,
    transactionId?: string,
    orderBy: QueryOrder[] = [],
  ): Promise<FirestoreRestQuerySnapshot> {
    const structuredQuery: Record<string, unknown> = {
      from: [{ collectionId: collection }],
    };
    if (filters.length === 1) {
      structuredQuery.where = this.serializeFilter(filters[0]);
    } else if (filters.length > 1) {
      structuredQuery.where = {
        compositeFilter: {
          op: "AND",
          filters: filters.map((filter) => this.serializeFilter(filter)),
        },
      };
    }
    if (orderBy.length > 0) {
      structuredQuery.orderBy = orderBy.map(({ fieldPath, direction }) => ({
        field: { fieldPath },
        direction: direction === "asc" ? "ASCENDING" : "DESCENDING",
      }));
    }
    if (limit !== undefined) structuredQuery.limit = limit;

    const response = await this.request<
      Array<{ document?: FirestoreDocument }>
    >(`${this.documentsUrl}:runQuery`, {
      method: "POST",
      body: JSON.stringify({
        structuredQuery,
        ...(transactionId ? { transaction: transactionId } : {}),
      }),
    });
    const docs = response.flatMap(({ document }) => {
      if (!document) return [];
      const path = document.name.slice(
        `${this.documentResourcePath}/`.length,
      );
      return [new FirestoreRestQueryDocumentSnapshot(this, path, document)];
    });
    return new FirestoreRestQuerySnapshot(docs);
  }

  async writeDocument(write: FirestoreWrite) {
    await this.request(`${this.documentsUrl}:commit`, {
      method: "POST",
      body: JSON.stringify({ writes: [write] }),
    });
  }

  async beginTransaction() {
    const response = await this.request<{ transaction: string }>(
      `${this.documentsUrl}:beginTransaction`,
      {
        method: "POST",
        body: JSON.stringify({ options: { readWrite: {} } }),
      },
    );
    return response.transaction;
  }

  async commit(transaction: string, writes: FirestoreWrite[]) {
    await this.request(`${this.documentsUrl}:commit`, {
      method: "POST",
      body: JSON.stringify({ transaction, writes }),
    });
  }

  async rollback(transaction: string) {
    await this.request(`${this.documentsUrl}:rollback`, {
      method: "POST",
      body: JSON.stringify({ transaction }),
    });
  }

  documentName(path: string) {
    return `${this.documentsUrl}/${path}`;
  }

  encodeDocument(data: FirestoreData): FirestoreDocument {
    const fields: Record<string, FirestoreValue> = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) fields[key] = this.encodeValue(value);
    }
    return { name: "", fields };
  }

  decodeFields(fields: Record<string, FirestoreValue> | undefined) {
    return Object.fromEntries(
      Object.entries(fields ?? {}).map(([key, value]) => [
        key,
        this.decodeValue(value),
      ]),
    );
  }

  private serializeFilter(filter: QueryFilter) {
    return {
      fieldFilter: {
        field: { fieldPath: filter.fieldPath },
        op: filter.operator === "==" ? "EQUAL" : "LESS_THAN_OR_EQUAL",
        value: this.encodeValue(filter.value),
      },
    };
  }

  private encodeValue(value: unknown): FirestoreValue {
    if (value === null) return { nullValue: "NULL_VALUE" };
    if (value instanceof Date) {
      if (Number.isNaN(value.getTime())) {
        throw new TypeError("Firestore cannot store an invalid Date.");
      }
      return { timestampValue: value.toISOString() };
    }
    if (typeof value === "string") return { stringValue: value };
    if (typeof value === "boolean") return { booleanValue: value };
    if (typeof value === "number") {
      if (!Number.isFinite(value)) {
        throw new TypeError("Firestore cannot store a non-finite number.");
      }
      return Number.isInteger(value)
        ? { integerValue: String(value) }
        : { doubleValue: value };
    }
    if (Array.isArray(value)) {
      return {
        arrayValue: {
          values: value.map((item) => this.encodeValue(item)),
        },
      };
    }
    if (typeof value === "object" && value !== null) {
      const fields: Record<string, FirestoreValue> = {};
      for (const [key, nestedValue] of Object.entries(value)) {
        if (nestedValue !== undefined) {
          fields[key] = this.encodeValue(nestedValue);
        }
      }
      return { mapValue: { fields } };
    }
    throw new TypeError(`Unsupported Firestore value: ${String(value)}`);
  }

  private decodeValue(value: FirestoreValue): unknown {
    if ("nullValue" in value) return null;
    if ("booleanValue" in value) return value.booleanValue;
    if ("integerValue" in value) return Number(value.integerValue);
    if ("doubleValue" in value) return value.doubleValue;
    if ("stringValue" in value) return value.stringValue;
    if ("timestampValue" in value) return new Date(value.timestampValue);
    if ("arrayValue" in value) {
      return (value.arrayValue.values ?? []).map((item) =>
        this.decodeValue(item),
      );
    }
    return this.decodeFields(value.mapValue.fields);
  }

  private async request<T = void>(
    url: string,
    init: RequestInit = {},
  ): Promise<T> {
    const accessToken = await this.getAccessToken();
    const response = await fetch(url, {
      ...init,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        ...(init.body ? { "Content-Type": "application/json" } : {}),
        ...init.headers,
      },
    });
    const body = await response.text();
    if (!response.ok) {
      let message = body || `Firestore request failed with ${response.status}.`;
      let code: string | undefined;
      try {
        const error = JSON.parse(body) as {
          error?: { message?: string; status?: string };
        };
        message = error.error?.message ?? message;
        code = error.error?.status;
      } catch {
        // Keep the response body when Firestore does not return JSON.
      }
      throw new FirestoreRestError(message, response.status, code);
    }
    return (body ? JSON.parse(body) : undefined) as T;
  }
}

export class FirestoreRestQuery {
  readonly filters: QueryFilter[];
  readonly resultLimit?: number;
  readonly orderByFields: QueryOrder[];

  constructor(
    readonly client: FirestoreRestClient,
    readonly collection: string,
    filters: QueryFilter[] = [],
    resultLimit?: number,
    orderByFields: QueryOrder[] = [],
  ) {
    this.filters = filters;
    this.resultLimit = resultLimit;
    this.orderByFields = orderByFields;
  }

  where(fieldPath: string, operator: FilterOperator, value: unknown) {
    return new FirestoreRestQuery(
      this.client,
      this.collection,
      [...this.filters, { fieldPath, operator, value }],
      this.resultLimit,
      this.orderByFields,
    );
  }

  orderBy(fieldPath: string, direction: "asc" | "desc" = "asc") {
    return new FirestoreRestQuery(
      this.client,
      this.collection,
      this.filters,
      this.resultLimit,
      [...this.orderByFields, { fieldPath, direction }],
    );
  }

  limit(value: number) {
    if (!Number.isInteger(value) || value < 0) {
      throw new RangeError("Firestore query limit must be a non-negative integer.");
    }
    return new FirestoreRestQuery(
      this.client,
      this.collection,
      this.filters,
      value,
      this.orderByFields,
    );
  }

  get() {
    return this.client.getQuery(
      this.collection,
      this.filters,
      this.resultLimit,
      undefined,
      this.orderByFields,
    );
  }
}

export class FirestoreRestCollection extends FirestoreRestQuery {
  constructor(client: FirestoreRestClient, readonly id: string) {
    super(client, id);
  }

  doc(id: string) {
    return new FirestoreRestDocumentReference(this.client, `${this.id}/${id}`);
  }
}

export class FirestoreRestDocumentReference {
  readonly id: string;

  constructor(
    protected readonly client: FirestoreRestClient,
    readonly path: string,
  ) {
    this.id = path.slice(path.lastIndexOf("/") + 1);
  }

  async get() {
    return this.client.getDocument(this.path);
  }

  async set(data: FirestoreData, options?: { merge?: boolean }) {
    const update = this.client.encodeDocument(data);
    update.name = this.client.documentName(this.path);
    const write: FirestoreWrite =
      options?.merge === true
        ? {
            update,
            updateMask: { fieldPaths: Object.keys(update.fields ?? {}) },
          }
        : { update };
    await this.client.writeDocument(write);
  }

  async delete() {
    await this.client.writeDocument({
      delete: this.client.documentName(this.path),
    });
  }
}

export class FirestoreRestDocumentSnapshot {
  readonly id: string;
  readonly exists: boolean;
  readonly ref: FirestoreRestDocumentReference;

  constructor(
    private readonly client: FirestoreRestClient,
    readonly path: string,
    private readonly document?: FirestoreDocument,
  ) {
    this.id = path.slice(path.lastIndexOf("/") + 1);
    this.exists = document !== undefined;
    this.ref = new FirestoreRestDocumentReference(client, path);
  }

  data(): FirestoreData | undefined {
    return this.document
      ? this.client.decodeFields(this.document.fields)
      : undefined;
  }
}

export class FirestoreRestQuerySnapshot {
  constructor(readonly docs: FirestoreRestQueryDocumentSnapshot[]) {}

  get size() {
    return this.docs.length;
  }

  get empty() {
    return this.docs.length === 0;
  }
}

export class FirestoreRestQueryDocumentSnapshot extends FirestoreRestDocumentSnapshot {
  data(): FirestoreData {
    return super.data() ?? {};
  }
}

export class FirestoreRestTransaction {
  readonly writes: FirestoreWrite[] = [];

  constructor(
    private readonly client: FirestoreRestClient,
    private readonly transactionId: string,
  ) {}

  get(
    target: FirestoreRestDocumentReference,
  ): Promise<FirestoreRestDocumentSnapshot>;
  get(target: FirestoreRestQuery): Promise<FirestoreRestQuerySnapshot>;
  get(
    target: FirestoreRestDocumentReference | FirestoreRestQuery,
  ): Promise<FirestoreRestDocumentSnapshot | FirestoreRestQuerySnapshot> {
    if (target instanceof FirestoreRestDocumentReference) {
      return this.client.getDocument(target.path, this.transactionId);
    }
    return this.client.getQuery(
      target.collection,
      target.filters,
      target.resultLimit,
      this.transactionId,
      target.orderByFields,
    );
  }

  set(
    reference: FirestoreRestDocumentReference,
    data: FirestoreData,
    options?: { merge?: boolean },
  ) {
    const update = this.client.encodeDocument(data);
    update.name = this.client.documentName(reference.path);
    this.writes.push(
      options?.merge === true
        ? {
            update,
            updateMask: { fieldPaths: Object.keys(update.fields ?? {}) },
          }
        : { update },
    );
  }

  create(reference: FirestoreRestDocumentReference, data: FirestoreData) {
    const update = this.client.encodeDocument(data);
    update.name = this.client.documentName(reference.path);
    this.writes.push({ update, currentDocument: { exists: false } });
  }

  delete(reference: FirestoreRestDocumentReference) {
    this.writes.push({
      delete: this.client.documentName(reference.path),
    });
  }
}
