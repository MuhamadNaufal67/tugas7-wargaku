import { headers } from "next/headers";

type ServiceItem = {
  id: number;
  title: string;
  description: string;
  detail: string;
};

async function getServices() {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");

  if (!host) {
    throw new Error("Host header is not available.");
  }

  const protocol =
    requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");

  const response = await fetch(`${protocol}://${host}/api/services`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch services.");
  }

  return (await response.json()) as ServiceItem[];
}

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div className="space-y-8">
      <section className="rounded-[2.5rem] border border-white/80 bg-white/92 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] lg:p-10">
        <span className="inline-flex rounded-full bg-[var(--color-primary-soft)] px-4 py-2 text-sm font-semibold text-[var(--color-primary)]">
          Layanan Utama
        </span>
        <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
          Fitur inti WargaKu untuk kebutuhan administrasi RT digital.
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
          Data layanan di bawah ini diambil dari route handler
          <span className="font-semibold text-slate-900"> /api/services </span>
          menggunakan `fetch` pada Server Component.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {services.map((service, index) => (
          <article
            key={service.id}
            className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-[0_18px_50px_rgba(15,23,42,0.07)]"
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-primary-soft)] text-lg font-extrabold text-[var(--color-primary)]">
                0{index + 1}
              </span>
              <span className="rounded-full bg-[#fff2e8] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-accent)]">
                Service
              </span>
            </div>
            <h2 className="mt-6 text-2xl font-bold text-slate-900">
              {service.title}
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              {service.description}
            </p>
            <div className="mt-6 rounded-[1.5rem] bg-slate-50 p-4">
              <p className="text-sm leading-7 text-slate-600">{service.detail}</p>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
