import { demoCommerceSnapshot } from "@mgd/widgets";

const snapshot = demoCommerceSnapshot;

export default function CommercePage() {
  return (
    <main className="min-h-screen bg-[#050816] px-6 py-8 text-white lg:px-8 lg:py-10">
      <div className="mx-auto max-w-6xl">
        <section className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8 shadow-2xl shadow-black/25 backdrop-blur-xl lg:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#6D5DFC]">
            MGD OS
          </p>
          <h1 className="mt-4 text-5xl font-semibold">Commerce Center</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-white/60">
            Fonte comercial do MGD OS. Este Center gera snapshots, metricas e
            eventos que alimentam o Command Center, Business Brain e Advisor.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-[#050816]/35 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/35">
                Receita hoje
              </p>
              <p className="mt-3 text-2xl font-semibold text-emerald-300">
                R$ {snapshot.metrics.revenue.today.toLocaleString("pt-BR")}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#050816]/35 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/35">
                Pedidos
              </p>
              <p className="mt-3 text-2xl font-semibold">
                {snapshot.metrics.ordersCount}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#050816]/35 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/35">
                Estoque critico
              </p>
              <p className="mt-3 text-2xl font-semibold text-rose-300">
                {snapshot.metrics.inventory.criticalStockCount}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#050816]/35 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/35">
                Clientes VIP
              </p>
              <p className="mt-3 text-2xl font-semibold text-violet-200">
                {snapshot.metrics.customers.vipCustomers}
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
