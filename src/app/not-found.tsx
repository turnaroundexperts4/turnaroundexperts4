import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-paper px-6 py-12 text-center">
      <section>
        <span className="font-mono text-[12px] uppercase tracking-[0.32em] text-ink-500">
          404
        </span>
        <h1 className="display-font mt-4 text-[clamp(2rem,4vw,3.2rem)] font-medium leading-[1.1] tracking-[-0.02em] text-navy-900">
          That page isn&apos;t here.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-[15px] text-ink-700">
          The link may be broken, or the page may have been moved. Try the
          homepage or book a call directly.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-navy-900 px-6 py-3 text-[14px] font-medium text-paper transition hover:bg-navy-800"
          >
            Back to home
          </Link>
          <Link
            href="/book-appointment"
            className="inline-flex items-center gap-2 rounded-full border border-ink-900/15 px-6 py-3 text-[14px] font-medium text-ink-900 transition hover:bg-ink-900/[0.04]"
          >
            Book a consultation
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
