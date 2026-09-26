# TurnAround Experts Code Audit

**Audit date:** 2026-09-23  
**Repository:** `turnaroundexperts4/turnaroundexperts4`  
**Scope:** Application source, authentication, Firebase integration, data access, API routes, admin area, deployment configuration, and project-level tooling.

## 1. Executive summary

This is a Next.js application using:

- React and the App Router for the web UI.
- Firebase Authentication for public/customer accounts.
- Firebase Admin SDK for server-side token verification and Firestore content.
- PostgreSQL with Drizzle as a legacy/fallback data source.
- Iron Session for the separate admin-panel session.
- Cloudflare Workers/OpenNext for deployment.

The codebase has two independent authentication systems:

1. **Customer authentication:** Firebase client SDK in the browser.
2. **Admin authentication:** Server action plus Iron Session, with Firebase password verification attempted first and PostgreSQL fallback second.

The Google login issue was reproduced locally:

1. The Google account chooser opens.
2. Google account selection succeeds.
3. Firebase rejects the returned credential with `auth/invalid-credential`.
4. The user remains unauthenticated.

This proves the button is wired and Google is reachable. The failure occurs during Firebase provider credential validation. The repository also contains code-level weaknesses that make this harder to diagnose:

- Google errors are handled in the button component rather than centrally.
- Email/password errors are reduced to a generic message.
- Popup and redirect approaches were mixed during debugging.
- Client Firebase configuration is build-time configuration, while deployment secrets are runtime configuration.
- Firebase Admin failures can become `null` authentication responses instead of explicit service failures.
- The public account page depends on both browser Firebase state and server Firebase Admin credentials.

The current Google error is most likely caused by Firebase OAuth/provider configuration or a mismatch between the Firebase project used by the browser bundle and the OAuth client/provider configuration. The code should still be hardened so the exact cause is observable and the authentication state is handled consistently.

## 2. Follow-up remediation plan

### Dependency advisories (F-15)

The current `npm audit --audit-level=high` report contains one high PostCSS
advisory and moderate advisories affecting transitive `esbuild` and `uuid`
packages.

- **PostCSS:** the audit recommends a dependency graph update that upgrades
  Next.js to a newer major release. This can affect App Router behavior,
  middleware/runtime compatibility, OpenNext output, and the current
  `eslint-config-next` pairing.
- **esbuild:** the vulnerable version is pulled through the pinned
  `drizzle-kit` range. Updating `drizzle-kit` may change schema/introspection
  output and migration behavior.
- **uuid:** the vulnerable version is transitive through Google client
  libraries and should be resolved by the next compatible dependency update.

**Owner:** repository maintainer. **Timeline:** schedule within the next
maintenance sprint, first in a staging branch. The upgrade must be performed
deliberately with `npm audit --audit-level=high`, typecheck, lint, build,
authentication smoke tests, booking tests, and Cloudflare preview validation
before production deployment. No forced upgrade is included in this audit
pass.

### Credential incident

The historically committed Firebase service-account key is considered
compromised. Human confirmation is required for revocation, replacement-key
deployment, and GCP/Firebase audit-log review. The repository must not contain
the replacement JSON key or private key material.

### Data-handling policy draft (F-11)

The application stores customer name, email, phone, optional company,
appointment date/time, service selection, enquiry text, Firebase UID, and
workflow history. Data may exist in Firestore/Firebase and in the PostgreSQL
fallback database. Access is limited to the authenticated customer for their
own account data and authorized administrators for operational processing.

Retain active appointment and enquiry records only as long as needed for
customer service, accounting, and legal obligations. The maintainer should
set and publish a concrete retention period before production launch; a
recommended default is 24 months after the last customer interaction, with
longer retention only where legally required.

Deletion requests must be verified by the account email/UID and processed by
an administrator. The deletion operation must remove the customer’s
appointments, enquiries, Firebase-auth account data where appropriate, and
matching PostgreSQL rows, with an audit record containing only the request
identifier and completion timestamp. A production deletion action is not yet
implemented; this remains an open engineering item.

## 2. Architecture overview

```text
Browser
  |
  |-- RootLayout
  |     `-- UserAuthProvider
  |           |-- Firebase Auth observer
  |           |-- email/password sign-in
  |           `-- Google sign-in
  |
  |-- Public pages
  |     |-- Account -> AuthRequired -> UserAuthCard
  |     |-- Booking form
  |     `-- Contact form
  |
  `-- Firebase ID token in Authorization/FormData
             |
             v
Next.js route handlers/server actions
  |
  |-- verifyFirebaseIdToken -> Firebase Admin Auth
  |-- data.ts -> Firebase content or PostgreSQL fallback
  `-- Iron Session -> admin-only pages
```

### Authentication boundaries

| Boundary | Mechanism | Used by | Main files |
|---|---|---|---|
| Public browser session | Firebase client Auth persistence | Account, booking, contact | `src/lib/firebase-client.ts`, `src/components/auth/user-auth-provider.tsx` |
| Public server authorization | Firebase Admin `verifyIdToken` | Account API, enquiry API, booking actions | `src/lib/firebase-auth.ts`, API/action files |
| Admin browser/server session | Iron Session encrypted cookie | Admin panel | `src/lib/auth.ts`, admin login actions/layout |
| Admin Firebase verification | Identity Toolkit REST + Firebase Admin user lookup | Admin login | `src/lib/firebase-auth.ts`, `src/app/admin/login/actions.ts` |

## 3. Authentication audit

### 3.1 Customer authentication flow

1. [`src/app/layout.tsx`](./src/app/layout.tsx) mounts `UserAuthProvider` around the entire application.
2. [`src/lib/firebase-client.ts`](./src/lib/firebase-client.ts) initializes the Firebase browser app from `NEXT_PUBLIC_FIREBASE_*` variables.
3. [`src/components/auth/user-auth-provider.tsx`](./src/components/auth/user-auth-provider.tsx) subscribes to `onAuthStateChanged`.
4. [`src/components/auth/user-auth-card.tsx`](./src/components/auth/user-auth-card.tsx) exposes:
   - Email/password sign-in.
   - Email/password account creation.
   - Google sign-in.
5. [`src/components/auth/auth-required.tsx`](./src/components/auth/auth-required.tsx) displays protected content only when a Firebase `user` exists.
6. [`src/app/(public)/account/page.tsx`](./src/app/(public)/account/page.tsx) obtains a Firebase ID token and calls the account API.

### 3.2 Google login result

The tested local flow currently uses:

```ts
signInWithPopup(clientAuth, new GoogleAuthProvider())
```

Observed behavior:

- Firebase auth iframe loads.
- Google account chooser loads.
- Account selection completes.
- Firebase returns `auth/invalid-credential`.
- `onAuthStateChanged` never receives a signed-in user.

The current code cannot correct an invalid credential returned by Firebase. It can, however, make diagnosis and recovery clearer. The provider setup and runtime project identity must be verified in Firebase Console and in the browser bundle.

### 3.3 Code-level authentication issues

#### High priority

1. **Google provider errors are handled only in the view.**  
   The provider returns a raw Firebase error while [`user-auth-card.tsx`](./src/components/auth/user-auth-card.tsx) interprets it. This spreads auth policy across UI code and makes other callers inconsistent.

2. **Email/password errors are swallowed.**  
   The form catches every error and shows the same message. Users and maintainers cannot distinguish:
   - `auth/user-not-found`
   - `auth/wrong-password`
   - `auth/invalid-credential`
   - `auth/operation-not-allowed`
   - `auth/too-many-requests`
   - `auth/network-request-failed`

3. **Popup and redirect flows were mixed during implementation.**  
   Redirect auth was added, but the callback state was not reliably established before the UI rendered. The tested correction restores popup auth, but the project should choose one supported flow and test it end-to-end.

4. **The auth provider does not expose a structured auth error.**  
   `authError` exists for Google failures, but email/password operations do not set it. A single typed error mapping should be used for all providers.

#### Medium priority

5. **No explicit provider readiness check.**  
   The UI does not verify whether Google is enabled before presenting the button. Firebase configuration errors only appear after an OAuth attempt.

6. **No loading state for Google sign-in.**  
   The Google button remains clickable while a popup request is in progress. Multiple attempts can create confusing concurrent auth states.

7. **No account-linking path.**  
   If a user creates an email/password account and later uses Google with the same email, Firebase may require credential linking. The UI does not explain or handle that case.

8. **The public auth provider is mounted globally.**  
   This is convenient, but it initializes Firebase Auth on every page, including pages that do not need an account. It also means any auth initialization problem affects the whole application.

### 3.4 Admin authentication flow

1. [`src/app/admin/login/actions.ts`](./src/app/admin/login/actions.ts) validates email/password with Zod.
2. It calls `verifyFirebasePassword`.
3. If Firebase returns `null`, it calls `verifyAdminPassword` against PostgreSQL.
4. Firebase users must have the `admin` custom claim or an `adminUsers/{uid}` Firestore document.
5. A successful login stores `adminUid` or legacy `adminId` in Iron Session.
6. [`src/app/admin/(protected)/layout.tsx`](./src/app/admin/(protected)/layout.tsx) rejects requests without the session.

The admin flow is independent from customer Firebase browser state. A customer login cannot access the admin panel, and an admin login does not populate the customer Firebase context.

### 3.5 Server-side Firebase authentication

[`src/lib/firebase-auth.ts`](./src/lib/firebase-auth.ts) provides:

- `verifyFirebaseIdToken`: Firebase Admin token verification.
- `verifyFirebasePassword`: Identity Toolkit password sign-in plus admin authorization.

The password REST request now has a five-second timeout and logs request failures before returning `null`. This prevents an unavailable Firebase endpoint from blocking the PostgreSQL fallback indefinitely.

The token verifier currently returns `null` when Firebase Admin is not configured. This is safe from an authorization perspective, but it hides an infrastructure failure as an ordinary invalid-user response.

## 4. Data and backend audit

### Data sources

The project has two data paths:

1. Firebase Admin/Firestore, used as the preferred content/backend source when configured.
2. PostgreSQL/Drizzle, used as a fallback for data and admin credentials.

This dual-source design increases availability but also increases complexity:

- Records can exist in one source but not the other.
- Authenticated users can succeed in the browser but fail server-side if Firebase Admin is unavailable.
- Admin writes and public reads may not use the same source.
- Debugging requires identifying the active source for each function.

### Main data files

- [`src/lib/data.ts`](./src/lib/data.ts): primary data abstraction and Firebase/PostgreSQL fallback orchestration.
- [`src/lib/firebase-content.ts`](./src/lib/firebase-content.ts): Firestore content CRUD and data mapping.
- [`src/db/index.ts`](./src/db/index.ts): Drizzle/PostgreSQL connection.
- [`src/db/schema.ts`](./src/db/schema.ts): PostgreSQL table definitions.
- [`src/lib/seed.ts`](./src/lib/seed.ts): database seed data.
- [`src/lib/seed-portfolio.ts`](./src/lib/seed-portfolio.ts): portfolio seed content.
- [`scripts/seed-firebase.ts`](./scripts/seed-firebase.ts): Firebase Admin seed script.

## 5. Complete file catalog

The catalog below covers the tracked application files and explains each file's responsibility, dependencies, and operational needs.

### 5.1 Root configuration and tooling

| File | Responsibility | Needs / dependencies |
|---|---|---|
| [`package.json`](./package.json) | Scripts and dependency manifest. | Node/npm, Next.js, Firebase, Drizzle, Cloudflare tooling. |
| [`package-lock.json`](./package-lock.json) | Locked dependency graph. | Must remain synchronized with `package.json`. |
| [`tsconfig.json`](./tsconfig.json) | TypeScript compiler settings and path aliases. | `tsc`, Next.js type generation. |
| [`next.config.ts`](./next.config.ts) | Next.js configuration. | Next.js build/runtime. |
| [`open-next.config.ts`](./open-next.config.ts) | OpenNext Cloudflare adapter configuration. | `@opennextjs/cloudflare`. |
| [`wrangler.jsonc`](./wrangler.jsonc) | Worker name, compatibility, public Firebase variables, assets, observability. | Wrangler and Cloudflare deployment. |
| [`firebase.json`](./firebase.json) | Firebase Rules file locations. | Firebase CLI. |
| [`firestore.rules`](./firestore.rules) | Firestore read/write authorization rules. | Firebase project deployment. |
| [`database.rules.json`](./database.rules.json) | Realtime Database rules. | Firebase Realtime Database deployment. |
| [`drizzle.config.json`](./drizzle.config.json) | Drizzle schema/database configuration. | `DATABASE_URL`, Drizzle CLI. |
| [`postcss.config.mjs`](./postcss.config.mjs) | Tailwind/PostCSS processing. | PostCSS and Tailwind. |
| [`eslint.config.mjs`](./eslint.config.mjs) | ESLint rules. | ESLint and Next.js plugin. |
| [`AGENTS.md`](./AGENTS.md) | Repository-specific Next.js guidance. | Must be followed for future changes. |
| [`CLAUDE.md`](./CLAUDE.md) | References repository instructions. | Documentation only. |
| [`.env.example`](./.env.example) | Environment-variable template. | Must stay aligned with deployment requirements. |
| [`firebase-service-account..json`](./firebase-service-account..json) | Service-account-looking file. | Must not contain an unrotated private key in Git. Verify history and rotate if needed. |

### 5.2 Application shell and public routes

| File | Responsibility | Needs / dependencies |
|---|---|---|
| [`src/app/layout.tsx`](./src/app/layout.tsx) | Root metadata, fonts, global CSS, `UserAuthProvider`. | Firebase client config for every browser page. |
| [`src/app/globals.css`](./src/app/globals.css) | Global styles and design tokens. | Tailwind/PostCSS. |
| [`src/app/not-found.tsx`](./src/app/not-found.tsx) | Global not-found page. | Shared branding components. |
| [`src/app/(public)/layout.tsx`](./src/app/(public)/layout.tsx) | Public navigation, footer, company/social settings. | `getSetting`, public shell components. |
| [`src/app/(public)/page.tsx`](./src/app/(public)/page.tsx) | Home page. | Public data and presentation components. |
| [`src/app/(public)/account/page.tsx`](./src/app/(public)/account/page.tsx) | Customer account and appointment status. | Firebase user, ID token, account API. |
| [`src/app/(public)/appointment/page.tsx`](./src/app/(public)/appointment/page.tsx) | Appointment lookup/entry surface. | Appointment viewer and API. |
| [`src/app/(public)/book-appointment/page.tsx`](./src/app/(public)/book-appointment/page.tsx) | Booking page. | Booking form, availability data. |
| [`src/app/(public)/book-appointment/actions.ts`](./src/app/(public)/book-appointment/actions.ts) | Validates and creates appointments. | Zod, data layer, Firebase token where required. |
| [`src/app/(public)/contact/page.tsx`](./src/app/(public)/contact/page.tsx) | Contact page. | Contact form. |
| [`src/app/(public)/founders/page.tsx`](./src/app/(public)/founders/page.tsx) | Founder content page. | Data layer and public UI. |
| [`src/app/(public)/blog/page.tsx`](./src/app/(public)/blog/page.tsx) | Blog listing. | Blog data and content components. |
| [`src/app/(public)/blog/[slug]/page.tsx`](./src/app/(public)/blog/%5Bslug%5D/page.tsx) | Blog detail page. | Slug lookup and metadata. |
| [`src/app/(public)/portfolio/page.tsx`](./src/app/(public)/portfolio/page.tsx) | Portfolio listing. | Portfolio data and explorer/carousel. |
| [`src/app/(public)/portfolio/[slug]/page.tsx`](./src/app/(public)/portfolio/%5Bslug%5D/page.tsx) | Portfolio detail page. | Slug lookup. |
| [`src/app/(public)/services/page.tsx`](./src/app/(public)/services/page.tsx) | Services listing. | Service data and icons. |
| [`src/app/(public)/services/[slug]/page.tsx`](./src/app/(public)/services/%5Bslug%5D/page.tsx) | Service detail page. | Slug lookup. |
| [`src/app/(public)/pricing/page.tsx`](./src/app/(public)/pricing/page.tsx) | Pricing page. | Static/public content. |
| [`src/app/(public)/privacy/page.tsx`](./src/app/(public)/privacy/page.tsx) | Privacy policy page. | Legal page component/content. |
| [`src/app/(public)/terms/page.tsx`](./src/app/(public)/terms/page.tsx) | Terms page. | Legal page component/content. |

### 5.3 Customer-facing components

| File | Responsibility | Needs / dependencies |
|---|---|---|
| [`src/components/auth/user-auth-provider.tsx`](./src/components/auth/user-auth-provider.tsx) | Firebase Auth context and provider operations. | Firebase client configuration. |
| [`src/components/auth/user-auth-card.tsx`](./src/components/auth/user-auth-card.tsx) | Sign-in/sign-up/Google UI and error display. | `useUserAuth`. |
| [`src/components/auth/auth-required.tsx`](./src/components/auth/auth-required.tsx) | Auth gate for protected customer content. | Firebase auth state. |
| [`src/components/public/booking-form.tsx`](./src/components/public/booking-form.tsx) | Appointment form and submission. | Availability API, Firebase ID token, server action/API. |
| [`src/components/public/contact-form.tsx`](./src/components/public/contact-form.tsx) | Contact/enquiry form. | Firebase ID token and enquiry API. |
| [`src/components/public/appointment-status-viewer.tsx`](./src/components/public/appointment-status-viewer.tsx) | Appointment status lookup UI. | Appointment API. |
| [`src/components/public/site-shell.tsx`](./src/components/public/site-shell.tsx) | Public navigation/header. | Brand and route links. |
| [`src/components/public/site-footer.tsx`](./src/components/public/site-footer.tsx) | Footer/company/social links. | Public layout settings. |
| [`src/components/public/legal-pages.tsx`](./src/components/public/legal-pages.tsx) | Shared legal page rendering. | Static legal content. |
| [`src/components/public/animated-backdrop.tsx`](./src/components/public/animated-backdrop.tsx) | Decorative animated background. | Framer Motion/browser runtime. |
| [`src/components/public/reveal.tsx`](./src/components/public/reveal.tsx) | Reveal animation wrapper. | Framer Motion/browser runtime. |
| [`src/components/public/project-carousel.tsx`](./src/components/public/project-carousel.tsx) | Portfolio carousel. | Portfolio records and client interaction. |
| [`src/components/public/portfolio-explorer.tsx`](./src/components/public/portfolio-explorer.tsx) | Portfolio filtering/exploration. | Portfolio records and client state. |
| [`src/components/public/service-icon.tsx`](./src/components/public/service-icon.tsx) | Service icon mapping. | Lucide React. |
| [`src/components/brand/logo.tsx`](./src/components/brand/logo.tsx) | Shared brand logo and wordmark. | Static image assets. |

### 5.4 API routes

| File | Responsibility | Authorization/needs |
|---|---|---|
| [`src/app/api/account/appointment/route.ts`](./src/app/api/account/appointment/route.ts) | Returns the authenticated user's appointment. | Firebase bearer token and Firebase Admin credentials. |
| [`src/app/api/appointments/[reference]/route.ts`](./src/app/api/appointments/%5Breference%5D/route.ts) | Looks up an appointment by reference. | Input validation and data layer. |
| [`src/app/api/availability/route.ts`](./src/app/api/availability/route.ts) | Returns available booking times. | Data layer. |
| [`src/app/api/enquiries/route.ts`](./src/app/api/enquiries/route.ts) | Creates/handles enquiries. | Firebase bearer token and validation. |
| [`src/app/api/health/route.ts`](./src/app/api/health/route.ts) | Reports Firebase/service health. | Firebase Admin state. |
| [`src/app/api/media/route.ts`](./src/app/api/media/route.ts) | Reads media through Firebase Admin. | Firebase Admin credentials. |
| [`src/app/api/upload/route.ts`](./src/app/api/upload/route.ts) | Handles media upload. | Iron Session admin authorization and Firebase Admin. |

### 5.5 Admin area

The admin area uses a consistent feature pattern:

```text
feature/actions.ts  -> server mutations and authorization
feature/page.tsx    -> server data loading
feature/client.tsx  -> interactive client manager
```

| Feature/files | Responsibility |
|---|---|
| [`src/app/admin/login/page.tsx`](./src/app/admin/login/page.tsx), [`login-form.tsx`](./src/app/admin/login/login-form.tsx), [`login/actions.ts`](./src/app/admin/login/actions.ts) | Admin login UI, validation, Firebase/PostgreSQL verification, session creation. |
| [`src/app/admin/logout/route.ts`](./src/app/admin/logout/route.ts) | Destroys admin session and redirects. |
| [`src/app/admin/(protected)/layout.tsx`](./src/app/admin/%28protected%29/layout.tsx) | Server-side admin session gate. |
| [`src/app/admin/(protected)/admin-shell.tsx`](./src/app/admin/%28protected%29/admin-shell.tsx) | Admin navigation and layout shell. |
| [`src/app/admin/(protected)/page.tsx`](./src/app/admin/%28protected%29/page.tsx) | Admin root redirect/entry. |
| [`src/app/admin/(protected)/dashboard/page.tsx`](./src/app/admin/%28protected%29/dashboard/page.tsx) | Dashboard metrics and recent activity. |
| [`src/app/admin/(protected)/appointments/*`](./src/app/admin/%28protected%29/appointments) | Appointment administration, status changes, notes, and manager UI. |
| [`src/app/admin/(protected)/availability/*`](./src/app/admin/%28protected%29/availability) | Availability rules and blocked dates. |
| [`src/app/admin/(protected)/blog/*`](./src/app/admin/%28protected%29/blog) | Blog/category administration. |
| [`src/app/admin/(protected)/enquiries/*`](./src/app/admin/%28protected%29/enquiries) | Enquiry review and status management. |
| [`src/app/admin/(protected)/founders/*`](./src/app/admin/%28protected%29/founders) | Founder record management. |
| [`src/app/admin/(protected)/portfolio/*`](./src/app/admin/%28protected%29/portfolio) | Portfolio/category management. |
| [`src/app/admin/(protected)/services/*`](./src/app/admin/%28protected%29/services) | Service/category management. |
| [`src/app/admin/(protected)/settings/*`](./src/app/admin/%28protected%29/settings) | Company/social/site settings. |
| [`src/app/admin/(protected)/team/*`](./src/app/admin/%28protected%29/team) | Team member management. |
| [`src/app/admin/_components/admin-fields.tsx`](./src/app/admin/_components/admin-fields.tsx) | Shared admin form fields and controls. |

Every admin server action must continue to call `requireAdmin()` before reading or mutating protected data.

### 5.6 Server libraries and database

| File | Responsibility | Needs / risks |
|---|---|---|
| [`src/lib/auth.ts`](./src/lib/auth.ts) | Iron Session options, cookie, admin session helpers. | `SESSION_SECRET` of at least 32 characters. |
| [`src/lib/firebase-client.ts`](./src/lib/firebase-client.ts) | Browser Firebase app/Auth/Firestore/Realtime Database initialization. | `NEXT_PUBLIC_FIREBASE_*` values are embedded at build time. |
| [`src/lib/firebase-admin.ts`](./src/lib/firebase-admin.ts) | Firebase Admin initialization and service exports. | `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`, database URL. |
| [`src/lib/firebase-auth.ts`](./src/lib/firebase-auth.ts) | Firebase ID-token verification and password REST auth. | Firebase Admin runtime plus client API key for password auth. |
| [`src/lib/firebase-content.ts`](./src/lib/firebase-content.ts) | Firestore content CRUD and record mapping. | Firebase Admin Firestore. |
| [`src/lib/data.ts`](./src/lib/data.ts) | Main Firebase/PostgreSQL data abstraction and fallback behavior. | Both data sources and consistent record mapping. |
| [`src/lib/utils.ts`](./src/lib/utils.ts) | Shared formatting/utility functions. | Imported by pages/components as needed. |
| [`src/lib/seed.ts`](./src/lib/seed.ts) | Seed users/content/database records. | Seed environment variables and database access. |
| [`src/lib/seed-portfolio.ts`](./src/lib/seed-portfolio.ts) | Portfolio seed records. | Data model/content assumptions. |
| [`src/db/index.ts`](./src/db/index.ts) | Drizzle database connection. | `DATABASE_URL` and PostgreSQL availability. |
| [`src/db/schema.ts`](./src/db/schema.ts) | Drizzle table/schema definitions. | Must match migrations/database. |
| [`scripts/seed-firebase.ts`](./scripts/seed-firebase.ts) | Firebase content/admin seeding. | Firebase Admin credentials. |
| [`scripts/generate-icons.ts`](./scripts/generate-icons.ts) | Generates icon assets. | Sharp/static asset output. |

## 6. Configuration audit

### Public client variables

These are expected in the browser bundle:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_DATABASE_URL`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`

Firebase web API keys are normally public identifiers. They still must belong to the intended Firebase project and have appropriate API restrictions.

### Server-only variables

These must remain secret:

- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`
- `SESSION_SECRET`
- `DATABASE_URL`
- `SEED_ADMIN_EMAIL`
- `SEED_ADMIN_PASSWORD`

The deployment must provide the server variables at runtime. Client variables must be present when the Next.js browser bundle is built; adding them only after deployment does not change an already-built client bundle.

### Configuration inconsistencies

- `.env.local` contains the expected local Firebase client and Admin variables.
- `.dev.vars` does not contain the `NEXT_PUBLIC_FIREBASE_*` client variables.
- `wrangler.jsonc` contains public Firebase variables, but server secrets must be added through Cloudflare secret configuration.
- The production metadata references `turnaroundexperts.info`, while the domain is currently unpaid/unavailable. Local testing should use `localhost`.
- `firebase-service-account..json` has a service-account-looking name and must be verified as untracked/non-secret. If it ever contained a real private key and was committed, rotate it.

## 7. Security and reliability findings

| ID | Severity | Finding | Impact | Recommendation |
|---|---|---|---|---|
| AUTH-01 | High | Google OAuth returns `auth/invalid-credential` after account selection. | Users cannot use Google login. | Verify the Firebase Google provider, OAuth client/project identity, support email, and built browser config. |
| AUTH-02 | High | Firebase Admin missing/malformed credentials become `null` verification results. | Valid users appear unauthorized on account, booking, and enquiry APIs. | Log and expose service health separately from invalid-user responses; fail closed with observable diagnostics. |
| AUTH-03 | High | Service-account-looking JSON file is present in the repository tree. | Possible credential exposure. | Check Git history, remove/ignore it, and rotate keys if it ever contained private material. |
| AUTH-04 | Medium | Client Firebase configuration is embedded at build time. | Deployment can use stale or wrong Firebase project values. | Verify values in the generated browser bundle and rebuild after configuration changes. |
| AUTH-05 | Medium | Email/password errors are hidden behind generic text. | Users and maintainers cannot distinguish configuration, throttling, and credential errors. | Centralize Firebase error-code mapping and show safe actionable messages. |
| AUTH-06 | Medium | No Google-button busy state. | Repeated clicks can create concurrent popup attempts. | Add provider-level pending state and disable the button while authenticating. |
| AUTH-07 | Medium | Two data backends are used as fallback sources. | Inconsistent records and difficult production diagnosis. | Document source precedence and add health/source diagnostics. |
| AUTH-08 | Low | Broken/missing `/images/tae-logo.svg` requests were observed locally. | Visual asset 404s and unnecessary requests. | Update references to an existing asset or add the expected SVG. |

## 8. Recommended implementation plan

### Phase 1: Make auth observable

1. Create a typed Firebase error mapper shared by email/password and Google flows.
2. Add provider pending state and disable all auth buttons while a request is active.
3. Log only safe Firebase error codes and request context; never log tokens or passwords.
4. Add a development-only diagnostic showing the Firebase project ID and auth domain.
5. Add an explicit `/api/health` check for Firebase Admin configuration and project identity.

### Phase 2: Correct Google configuration

1. Confirm the Google provider is enabled for project `tae-bef9c`.
2. Confirm the support email is saved.
3. Confirm the OAuth consent screen belongs to the same Google Cloud project.
4. Confirm the web client ID used by Firebase belongs to project `tae-bef9c`.
5. Confirm `localhost` and the actual deployed hostname are authorized domains.
6. Rebuild the client after any environment change.
7. Retest from a clean browser profile.

### Phase 3: Harden server auth

1. Distinguish `Firebase Admin unavailable` from `invalid token`.
2. Assert that the Admin service-account project matches `FIREBASE_PROJECT_ID`.
3. Add integration tests for:
   - valid Firebase ID token;
   - expired token;
   - missing Admin credentials;
   - wrong-project Admin credentials;
   - account API unauthorized response.
4. Add an end-to-end test for Google sign-in using a test Firebase project/account.

### Phase 4: Simplify data access

1. Document Firebase-versus-PostgreSQL source precedence per operation.
2. Add health/source information to diagnostics.
3. Avoid silently falling back for errors that indicate data corruption or authorization failure.

## 9. Validation performed

- TypeScript checks passed with `npm run typecheck`.
- The local admin login succeeded using the supplied admin credentials.
- The local account page rendered.
- Google OAuth account chooser opened.
- Google account selection completed.
- Firebase then returned `auth/invalid-credential`.
- The user remained unauthenticated.
- The repository was checked for auth-related files, environment variable names, routes, and provider usage.

## 10. Conclusion

The customer authentication architecture is understandable but currently overcomplicated by:

- a browser Firebase session;
- Firebase Admin server verification;
- a separate Iron Session admin system;
- Firebase and PostgreSQL data fallback;
- build-time client configuration and runtime server secrets.

The reproduced Google failure is not caused by the account page failing to call Firebase. The call reaches Google and returns to Firebase. The rejection occurs at Firebase credential validation. The most important code work is to improve observability and consistency; the actual `auth/invalid-credential` acceptance decision still depends on the Firebase provider/OAuth configuration and the exact Firebase project values embedded in the browser bundle.
