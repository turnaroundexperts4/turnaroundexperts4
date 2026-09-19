import type { Metadata } from "next";
import { Eyebrow, Reveal } from "@/components/public/reveal";
import { ContactForm } from "@/components/public/contact-form";
import { getSetting, listActiveServices } from "@/lib/data";

export const dynamic = "force-dynamic";

type Company = {
  name: string;
  phone: string;
  email: string;
  address: string;
};

export const metadata: Metadata = {
  title: "Contact TAE",
  description:
    "Get in touch with TurnAround Experts — phone, email, office and enquiry form.",
};

export default async function ContactPage() {
  const [services, company] = await Promise.all([
    listActiveServices(),
    getSetting<Company>("company", {
      name: "TurnAround Experts",
      phone: "+91 9512384715",
      email: "turnaroundexperts4@gmail.com",
      address: "Palanpur, Banaskantha, Gujarat, India",
    }),
  ]);

  return (
    <>
      <section className="bg-paper py-20 md:py-28">
        <div className="mx-auto max-w-[1380px] px-5 md:px-10">
          <Reveal>
            <Eyebrow>Contact</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="display-font mt-6 max-w-3xl text-balance text-[clamp(2.4rem,5.4vw,4.4rem)] font-medium leading-[1.05] tracking-[-0.03em] text-navy-900">
              Let&apos;s open a serious conversation.
            </h1>
          </Reveal>
          <Reveal delay={0.18}>
            <p className="mt-7 max-w-2xl text-[17px] leading-relaxed text-ink-700">
              Tell us about your business and what you&apos;d like help with.
              For most engagements, we&apos;ll suggest a 30-minute consultation.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-ink-900/5 bg-paper py-14 md:py-20">
        <div className="mx-auto grid max-w-[1380px] grid-cols-1 gap-10 px-5 md:px-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <ContactForm services={services} />
            </Reveal>
          </div>
          <Reveal className="lg:col-span-5" delay={0.1}>
            <div className="grid grid-cols-1 gap-3">
              <InfoBlock label="Office" value={company.address} />
              <InfoBlock
                label="Phone"
                value={company.phone}
                href={`tel:${company.phone.replace(/\s+/g, "")}`}
              />
              <InfoBlock
                label="Email"
                value={company.email}
                href={`mailto:${company.email}`}
              />
              <div className="rounded-2xl border border-ink-900/5 bg-white p-6">
                <div className="text-[11px] uppercase tracking-[0.22em] text-ink-500">
                  Prefer a scheduled call?
                </div>
                <p className="mt-3 text-[14.5px] leading-relaxed text-ink-700">
                  Most engagements begin with a 30-minute consultation.
                </p>
                <a
                  href="/book-appointment"
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-navy-900 px-5 py-2.5 text-[13px] font-medium text-paper transition hover:bg-navy-800"
                >
                  Book a slot
                  <span aria-hidden>→</span>
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function InfoBlock({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div className="rounded-2xl border border-ink-900/5 bg-white p-6">
      <div className="text-[11px] uppercase tracking-[0.22em] text-ink-500">
        {label}
      </div>
      {href ? (
        <a
          href={href}
          className="mt-2 inline-block break-all text-[16px] font-medium text-navy-900 hover:text-navy-800"
        >
          {value}
        </a>
      ) : (
        <div className="mt-2 text-[16px] font-medium text-navy-900">{value}</div>
      )}
    </div>
  );
}
