import type { Metadata } from "next";
import { Eyebrow, Reveal } from "@/components/public/reveal";
import { AppointmentStatusViewer } from "@/components/public/appointment-status-viewer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Check appointment status",
  description:
    "Look up the status of an existing TAE appointment using your reference id.",
};

export default async function AppointmentStatusPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const sp = await searchParams;
  return (
    <>
      <section className="bg-paper py-20 md:py-28">
        <div className="mx-auto max-w-[1100px] px-5 md:px-10">
          <Reveal>
            <Eyebrow>Appointments</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="display-font mt-6 max-w-3xl text-balance text-[clamp(2.2rem,4.6vw,3.6rem)] font-medium leading-[1.05] tracking-[-0.03em] text-navy-900">
              Look up your appointment status.
            </h1>
          </Reveal>
          <Reveal delay={0.18}>
            <p className="mt-7 max-w-2xl text-[17px] leading-relaxed text-ink-700">
              Enter your appointment reference id to see the latest status,
              including any reschedules proposed by the team.
            </p>
          </Reveal>
        </div>
      </section>
      <section className="border-t border-ink-900/5 bg-paper-deep py-14">
        <div className="mx-auto max-w-[1100px] px-5 md:px-10">
          <Reveal>
            <AppointmentStatusViewer initialReference={sp.ref} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
