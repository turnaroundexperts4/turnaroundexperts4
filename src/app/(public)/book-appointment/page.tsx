import type { Metadata } from "next";
import { Eyebrow, Reveal } from "@/components/public/reveal";
import { BookingForm } from "@/components/public/booking-form";
import { listActiveServices } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Book an Appointment",
  description:
    "Book a consultation directly with the TAE team. Choose a date, time and service — natively on the TAE website.",
};

export default async function BookAppointmentPage() {
  const services = await listActiveServices();

  return (
    <>
      <section className="bg-paper py-20 md:py-28">
        <div className="mx-auto max-w-[1380px] px-5 md:px-10">
          <Reveal>
            <Eyebrow>Book an appointment</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="display-font mt-6 max-w-3xl text-balance text-[clamp(2.4rem,5.4vw,4.4rem)] font-medium leading-[1.05] tracking-[-0.03em] text-navy-900">
              Schedule a call with the TAE team.
            </h1>
          </Reveal>
          <Reveal delay={0.18}>
            <p className="mt-7 max-w-2xl text-[17px] leading-relaxed text-ink-700">
              Pick a date and time below. All bookings are reviewed by the
              team — once approved, you&apos;ll receive a confirmation by email.
              This isn&apos;t a third-party redirect — your booking stays inside
              TAE.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-ink-900/5 bg-paper-deep py-14 md:py-20">
        <div className="mx-auto max-w-[1100px] px-5 md:px-10">
          <Reveal>
            <BookingForm services={services} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
