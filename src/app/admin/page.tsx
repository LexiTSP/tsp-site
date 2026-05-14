import { ShieldCheck, Activity, KeyRound, Clock, ExternalLink } from "lucide-react";
import type { ReactNode } from "react";

export const dynamic = "force-dynamic";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

interface Customer {
  id: string;
  displayName: string;
  status: string;
  contactEmail?: string;
  plan: string;
  retentionMode: string;
  createdAt: string;
}

interface OpsResponse {
  status: string;
  customers: number;
  health: Array<{
    customerId: string;
    risk?: unknown;
    evidence?: unknown;
    oversight?: unknown;
  }>;
}

export default async function AdminPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const token = typeof params.token === "string" ? params.token : "";
  const enabled = process.env.TSP_ADMIN_UI_ENABLED === "1";
  const expected = process.env.TSP_ADMIN_TOKEN;
  const baseUrl = process.env.CONTROL_PLANE_URL ?? "http://localhost:3942";

  if (!enabled || !expected || token !== expected) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
        <section className="mx-auto max-w-3xl rounded-lg border border-slate-800 bg-slate-900 p-6">
          <div className="mb-4 flex items-center gap-3 text-amber-300">
            <ShieldCheck className="h-5 w-5" />
            <h1 className="text-xl font-semibold">TSP internal control plane</h1>
          </div>
          <p className="text-sm leading-6 text-slate-300">
            Admin UI is disabled or the operator token is missing. Set <code>TSP_ADMIN_UI_ENABLED=1</code>, configure{" "}
            <code>TSP_ADMIN_TOKEN</code>, and open this page with a valid operator token during hosted pilot operations.
          </p>
        </section>
      </main>
    );
  }

  const [customers, ops] = await Promise.all([
    adminFetch<{ customers: Customer[] }>(baseUrl, "/admin/customers", token),
    adminFetch<OpsResponse>(baseUrl, "/admin/ops", token),
  ]);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-8">
        <header className="flex flex-col gap-3 border-b border-slate-800 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">Hosted pilot</p>
            <h1 className="mt-2 text-3xl font-semibold">TSP control plane</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">
              Internal operator surface for customers, health, queues, schedules, webhooks and manual metering export.
            </p>
          </div>
          <a
            href="/oversight/portal"
            className="inline-flex items-center gap-2 rounded-md border border-slate-700 px-3 py-2 text-sm text-slate-200 hover:border-cyan-400"
          >
            Reviewer portal <ExternalLink className="h-4 w-4" />
          </a>
        </header>

        <section className="grid gap-4 md:grid-cols-4">
          <Metric icon={<Activity />} label="Control plane" value={ops?.status ?? "unreachable"} />
          <Metric icon={<ShieldCheck />} label="Customers" value={String(customers?.customers.length ?? 0)} />
          <Metric icon={<KeyRound />} label="Auth mode" value="admin token" />
          <Metric icon={<Clock />} label="Billing" value="metering only" />
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="overflow-hidden rounded-lg border border-slate-800">
            <div className="border-b border-slate-800 bg-slate-900 px-4 py-3">
              <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-300">Customers</h2>
            </div>
            <div className="divide-y divide-slate-800">
              {(customers?.customers ?? []).map((customer) => (
                <CustomerRow key={customer.id} customer={customer} health={ops?.health.find((h) => h.customerId === customer.id)} baseUrl={baseUrl} token={token} />
              ))}
              {customers?.customers.length === 0 ? <Empty text="No hosted pilot customers provisioned yet." /> : null}
            </div>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-300">Operator notes</h2>
            <div className="mt-4 space-y-3 text-sm leading-6 text-slate-400">
              <p>Create and rotate API keys through the control-plane API. Secrets are shown once and only hashes are persisted downstream.</p>
              <p>Use metering export per customer for manual pilot invoicing. Stripe/self-serve billing is intentionally out of v0.</p>
              <p>Risk, Evidence and Oversight remain commercial backend alphas; this page is not a public product surface.</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Metric({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
      <div className="mb-3 text-cyan-300 [&_svg]:h-5 [&_svg]:w-5">{icon}</div>
      <div className="text-xs uppercase tracking-[0.14em] text-slate-500">{label}</div>
      <div className="mt-1 text-lg font-semibold text-slate-100">{value}</div>
    </div>
  );
}

function CustomerRow({
  customer,
  health,
  baseUrl,
  token,
}: {
  customer: Customer;
  health?: Record<string, unknown>;
  baseUrl: string;
  token: string;
}) {
  return (
    <article className="bg-slate-950 px-4 py-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold">{customer.displayName}</h3>
            <span className="rounded border border-cyan-700 px-2 py-0.5 text-xs text-cyan-200">{customer.status}</span>
            <span className="rounded border border-slate-700 px-2 py-0.5 text-xs text-slate-300">{customer.plan}</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">{customer.id} · {customer.retentionMode}</p>
          {customer.contactEmail ? <p className="mt-1 text-xs text-slate-400">{customer.contactEmail}</p> : null}
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <a className="rounded border border-slate-700 px-2 py-1 text-slate-300 hover:border-cyan-400" href={`${baseUrl}/admin/customers/${customer.id}/metering?format=csv`}>
            Metering CSV
          </a>
          <span className="rounded border border-slate-800 px-2 py-1 text-slate-500">token: {token.slice(0, 4)}...</span>
        </div>
      </div>
      <pre className="mt-4 max-h-48 overflow-auto rounded bg-slate-900 p-3 text-xs text-slate-300">
        {JSON.stringify(health ?? { status: "not reported" }, null, 2)}
      </pre>
    </article>
  );
}

function Empty({ text }: { text: string }) {
  return <div className="px-4 py-8 text-sm text-slate-500">{text}</div>;
}

async function adminFetch<T>(baseUrl: string, path: string, token: string): Promise<T | undefined> {
  try {
    const res = await fetch(`${baseUrl.replace(/\/$/, "")}${path}`, {
      headers: { authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return undefined;
    return (await res.json()) as T;
  } catch {
    return undefined;
  }
}
