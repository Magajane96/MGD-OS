import { demoCompanyState } from "@mgd/company-state";
import { mgdTheme } from "@mgd/design-system";
import {
  MGDAppShell,
  MGDBadge,
  MGDButton,
  MGDTopBar,
  MGDWidget,
  MetricLine,
  SectionHeader,
  Sparkline,
  TokenSwatch,
} from "@mgd/ui";

const state = demoCompanyState;

const healthSegments = [
  { label: "Financeiro", value: 96, tone: "from-emerald-300 to-[#6D5DFC]" },
  { label: "Marketing", value: 91, tone: "from-[#2F80FF] to-emerald-300" },
  { label: "Operacao", value: 88, tone: "from-[#6D5DFC] to-[#2F80FF]" },
  { label: "Clientes", value: 94, tone: "from-emerald-300 to-[#2F80FF]" },
  { label: "Estoque", value: 82, tone: "from-amber-300 to-[#6D5DFC]" },
  { label: "Conversao", value: 79, tone: "from-amber-300 to-emerald-300" },
];

const intelligenceSignals = [
  {
    title: "Receita crescendo.",
    detail: "A receita de hoje esta 18% acima do ritmo anterior.",
    tone: "success" as const,
  },
  {
    title: "Estoque critico.",
    detail: "Produto X precisa de reposicao antes do fim da semana.",
    tone: "danger" as const,
  },
  {
    title: "Clientes VIP.",
    detail: "128 clientes de alto valor estao prontos para nova oferta.",
    tone: "primary" as const,
  },
  {
    title: "Proxima acao sugerida.",
    detail: "Repor Produto X e manter a campanha de Instagram ativa.",
    tone: "warning" as const,
  },
];

const commandWidgets = [
  {
    title: "Receita",
    eyebrow: "Finance signal",
    status: `+${state.commerce.revenueTrendPercent}%`,
    value: `R$ ${state.commerce.revenueToday.toLocaleString("pt-BR")}`,
    caption: "Receita em tempo real",
    tone: "success" as const,
    footer: "Maior tracao vindo de campanhas sociais.",
    values: [35, 44, 42, 58, 66, 78, 92],
  },
  {
    title: "Pedidos",
    eyebrow: "Operations queue",
    status: "Atencao",
    value: state.commerce.ordersWaiting,
    caption: "pedidos aguardando envio",
    tone: "warning" as const,
    footer: "Separacao deve ser priorizada hoje.",
    values: [62, 57, 50, 54, 48, 45, 42],
  },
  {
    title: "Clientes",
    eyebrow: "Customer pulse",
    status: "Forte",
    value: "42",
    caption: "novos clientes hoje",
    tone: "success" as const,
    footer: "Base aquecida para recompra VIP.",
    values: [28, 36, 44, 52, 61, 69, 77],
  },
  {
    title: "Estoque",
    eyebrow: "Inventory risk",
    status: "Risco",
    value: state.commerce.inventoryRisk.length,
    caption: "produtos em atencao",
    tone: "danger" as const,
    footer: "Produto X exige reposicao imediata.",
    values: [82, 70, 63, 54, 45, 36, 28],
  },
];

const colorTokens = [
  {
    name: "App Background",
    value: mgdTheme.colors.background.app,
    description: "Base profunda do Command Center.",
  },
  {
    name: "Surface",
    value: mgdTheme.colors.background.surface,
    description: "Superficie principal dos paineis.",
  },
  {
    name: "Primary",
    value: mgdTheme.colors.brand.primary,
    description: "Assinatura de foco e acao.",
  },
  {
    name: "Success",
    value: mgdTheme.colors.semantic.success,
    description: "Saude, crescimento e operacao normal.",
  },
];

export default function CommandCenterPage() {
  return (
    <MGDAppShell>
      <div className="mx-auto max-w-7xl">
        <MGDTopBar />

        <section className="mb-6 grid gap-5 xl:grid-cols-[1.45fr_.55fr]">
          <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-gradient-to-br from-white/[0.10] via-white/[0.045] to-white/[0.025] p-7 shadow-2xl shadow-black/35 backdrop-blur-xl lg:p-9">
            <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <div className="pointer-events-none absolute right-[-120px] top-[-120px] h-80 w-80 rounded-full bg-[#6D5DFC]/18 blur-3xl" />
            <div className="pointer-events-none absolute bottom-[-140px] left-[-80px] h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />

            <div className="relative">
              <div className="flex flex-wrap items-center gap-3">
                <MGDBadge tone="primary">Executive cockpit</MGDBadge>
                <MGDBadge tone="success">Operational status online</MGDBadge>
              </div>

              <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-none tracking-tight text-white lg:text-7xl">
                Digital Mission Control
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-white/68">
                Sua empresa em modo cockpit executivo.
              </p>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                <div className="rounded-[24px] border border-white/10 bg-[#050816]/35 p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-white/35">
                    Business Health Score
                  </p>
                  <p className="mt-3 text-4xl font-semibold text-emerald-300">
                    {state.health.score}/100
                  </p>
                </div>
                <div className="rounded-[24px] border border-white/10 bg-[#050816]/35 p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-white/35">
                    Status operacional
                  </p>
                  <p className="mt-3 text-2xl font-semibold text-white">
                    Stable
                  </p>
                </div>
                <div className="rounded-[24px] border border-white/10 bg-[#050816]/35 p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-white/35">
                    Resumo executivo
                  </p>
                  <p className="mt-3 text-sm leading-6 text-white/65">
                    Receita em alta, operacao saudavel e estoque no radar.
                  </p>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <MGDButton>Executar acao sugerida</MGDButton>
                <MGDButton variant="secondary">Ver prioridades</MGDButton>
              </div>
            </div>
          </div>

          <MGDWidget
            title="Business Health"
            eyebrow="Company score"
            status={`${state.health.score}/100`}
            tone="success"
            className="bg-[#111A2E]/88"
          >
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-7xl font-bold tracking-tight">
                  {state.health.score}
                </p>
                <p className="mt-2 text-sm font-semibold text-emerald-300">
                  Empresa saudavel
                </p>
              </div>
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-right">
                <p className="text-xs text-white/45">Signal</p>
                <p className="mt-1 text-sm font-semibold text-emerald-300">
                  Strong
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {healthSegments.map((item) => (
                <div key={item.label}>
                  <div className="mb-1 flex justify-between text-xs text-white/50">
                    <span>{item.label}</span>
                    <span>{item.value}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className={`h-2 rounded-full bg-gradient-to-r ${item.tone}`}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </MGDWidget>
        </section>

        <section className="mb-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {commandWidgets.map((widget) => (
            <MGDWidget
              key={widget.title}
              title={widget.title}
              eyebrow={widget.eyebrow}
              status={widget.status}
              tone={widget.tone}
              footer={widget.footer}
            >
              <div className="text-4xl font-semibold">{widget.value}</div>
              <p className="mt-3 text-sm text-white/55">{widget.caption}</p>
              <div className="mt-5">
                <Sparkline values={widget.values} />
              </div>
            </MGDWidget>
          ))}
        </section>

        <section className="mb-6 grid gap-5 xl:grid-cols-[.85fr_1.15fr]">
          <MGDWidget
            title="Health"
            eyebrow="Barra de saude"
            status="6 areas"
            tone="primary"
            footer="Leitura consolidada do estado empresarial."
          >
            <div className="space-y-4">
              {healthSegments.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-semibold text-white/75">
                      {item.label}
                    </span>
                    <span className="text-sm font-semibold text-white">
                      {item.value}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className={`h-2 rounded-full bg-gradient-to-r ${item.tone}`}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </MGDWidget>

          <MGDWidget
            title="MGD Intelligence"
            eyebrow="Executive recommendations"
            status="4 insights"
            tone="info"
            footer="Recomendacoes geradas a partir dos sinais operacionais."
          >
            <div className="grid gap-4 md:grid-cols-2">
              {intelligenceSignals.map((signal) => (
                <div
                  key={signal.title}
                  className="rounded-2xl border border-white/10 bg-white/[0.035] p-4"
                >
                  <MGDBadge tone={signal.tone}>{signal.title}</MGDBadge>
                  <p className="mt-4 text-sm leading-6 text-white/60">
                    {signal.detail}
                  </p>
                </div>
              ))}
            </div>
          </MGDWidget>
        </section>

        <section className="mb-6 grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
          <MGDWidget
            title="Operations Timeline"
            eyebrow="Kernel events"
            status="Live"
            tone="success"
            footer="Eventos operacionais em tempo real."
          >
            <div className="space-y-4">
              {state.timeline.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 border-b border-white/10 pb-4 last:border-0 last:pb-0"
                >
                  <span className="min-w-12 text-sm text-white/35">
                    {item.time}
                  </span>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="mt-1 text-sm leading-6 text-white/50">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </MGDWidget>

          <MGDWidget
            title="Executive Summary"
            eyebrow="Next best actions"
            status="Pronto"
            tone="warning"
            footer="Ordenado por impacto no negocio."
          >
            <div className="space-y-3">
              <MetricLine label="Prioridade 1" value="Repor Produto X" tone="danger" />
              <MetricLine label="Prioridade 2" value="Separar pedidos" tone="warning" />
              <MetricLine label="Prioridade 3" value="Manter campanha" tone="success" />
              <MetricLine label="VIP motion" value="Ativar oferta" tone="primary" />
            </div>
          </MGDWidget>
        </section>

        <section className="rounded-[34px] border border-white/10 bg-white/[0.025] p-6 backdrop-blur-xl lg:p-8">
          <SectionHeader
            eyebrow="Design language"
            title="Premium control surfaces"
            description="Tokens preservados como base visual compartilhada para Command, Commerce e os proximos Centers."
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {colorTokens.map((token) => (
              <TokenSwatch key={token.name} {...token} />
            ))}
          </div>
        </section>
      </div>
    </MGDAppShell>
  );
}
