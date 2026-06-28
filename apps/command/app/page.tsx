import { generateExecutiveBriefing } from "@mgd/advisor";
import { generateBusinessHealthReport } from "@mgd/business-brain";
import { demoCompanyState } from "@mgd/company-state";
import { mgdTheme } from "@mgd/design-system";
import {
  getLiveActivity,
  getNotifications,
  publishEvent,
  seedCommandCenterEvents,
  type MGDRealtimePriority,
} from "@mgd/events";
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
import { demoCommerceSnapshot, generateCommerceEvents } from "@mgd/widgets";

const state = demoCompanyState;
const commerceSnapshot = demoCommerceSnapshot;
seedCommandCenterEvents();
generateCommerceEvents(commerceSnapshot).forEach((event) =>
  publishEvent(event),
);
const healthReport = generateBusinessHealthReport(state, { commerceSnapshot });
const executiveBriefing = generateExecutiveBriefing(healthReport);

const liveActivity = getLiveActivity(7);
const notifications = getNotifications(5);

const healthToneStyles = {
  success: "from-emerald-300 to-[#6D5DFC]",
  warning: "from-amber-300 to-[#6D5DFC]",
  danger: "from-rose-300 to-amber-300",
  info: "from-[#2F80FF] to-emerald-300",
  primary: "from-[#6D5DFC] to-[#2F80FF]",
  neutral: "from-white/40 to-white/20",
} as const;

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

const commerceKpis = [
  {
    title: "Live Orders",
    eyebrow: "Commerce stream",
    status: `${commerceSnapshot.metrics.ordersCount} orders`,
    value: commerceSnapshot.metrics.ordersCount,
    caption: `${commerceSnapshot.metrics.pendingOrders} pedidos pendentes`,
    tone: commerceSnapshot.metrics.pendingOrders > 2 ? "warning" : "success",
    trend: commerceSnapshot.orders.map((order) =>
      Math.max(18, order.total / 28),
    ),
    footer: "Pedidos consolidados pelo Commerce Adapter.",
  },
  {
    title: "Revenue Today",
    eyebrow: "Sales pulse",
    status: "Hoje",
    value: `R$ ${commerceSnapshot.metrics.revenue.today.toLocaleString("pt-BR")}`,
    caption: `Semana R$ ${commerceSnapshot.metrics.revenue.week.toLocaleString("pt-BR")}`,
    tone: "success",
    trend: [28, 42, 58, 67, 73, 84, 92],
    footer: "Receita calculada a partir dos pedidos do dia.",
  },
  {
    title: "Average Ticket",
    eyebrow: "Order quality",
    status: "Ticket",
    value: `R$ ${commerceSnapshot.metrics.revenue.averageTicket.toLocaleString("pt-BR")}`,
    caption: `${commerceSnapshot.metrics.revenue.conversionRate.toFixed(1)}% conversao`,
    tone: "primary",
    trend: [34, 46, 48, 55, 63, 69, 76],
    footer: "Ticket medio e conversao simulada para leitura executiva.",
  },
  {
    title: "Inventory Risk",
    eyebrow: "Critical stock",
    status:
      commerceSnapshot.metrics.inventory.criticalStockCount > 0
        ? "Atencao"
        : "Seguro",
    value: commerceSnapshot.metrics.inventory.criticalStockCount,
    caption: "produtos criticos",
    tone:
      commerceSnapshot.metrics.inventory.criticalStockCount > 0
        ? "danger"
        : "success",
    trend: [88, 72, 60, 48, 42, 34, 28],
    footer: "Produtos abaixo do estoque de seguranca.",
  },
] as const;

const priorityTone: Record<
  MGDRealtimePriority,
  "neutral" | "success" | "warning" | "danger" | "info" | "primary"
> = {
  low: "neutral",
  normal: "info",
  high: "warning",
  critical: "danger",
};

export default function CommandCenterPage() {
  return (
    <MGDAppShell>
      <div className="mx-auto max-w-7xl">
        <MGDTopBar />

        <section className="mb-6 grid gap-5 xl:grid-cols-[1.35fr_.65fr]">
          <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-gradient-to-br from-white/[0.10] via-white/[0.045] to-white/[0.025] p-7 shadow-2xl shadow-black/35 backdrop-blur-xl lg:p-9">
            <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <div className="pointer-events-none absolute right-[-120px] top-[-120px] h-80 w-80 rounded-full bg-[#6D5DFC]/18 blur-3xl" />
            <div className="pointer-events-none absolute bottom-[-140px] left-[-80px] h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />

            <div className="relative">
              <div className="flex flex-wrap items-center gap-3">
                <MGDBadge tone="primary">Commerce Integration</MGDBadge>
                <MGDBadge tone="success">Operational status online</MGDBadge>
                <MGDBadge tone="info">Sprint 008</MGDBadge>
              </div>

              <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-none tracking-tight text-white lg:text-7xl">
                Digital Mission Control
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-white/68">
                Sua empresa em modo cockpit executivo, agora recebendo eventos,
                metricas e sinais comerciais em tempo real.
              </p>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                <div className="rounded-[24px] border border-white/10 bg-[#050816]/35 p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-white/35">
                    Business Health Score
                  </p>
                  <p className="mt-3 text-4xl font-semibold text-emerald-300">
                    {healthReport.score}/100
                  </p>
                </div>
                <div className="rounded-[24px] border border-white/10 bg-[#050816]/35 p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-white/35">
                    Company Pulse
                  </p>
                  <p className="mt-3 text-2xl font-semibold text-white">
                    {healthReport.operatingMode}
                  </p>
                </div>
                <div className="rounded-[24px] border border-white/10 bg-[#050816]/35 p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-white/35">
                    Executive focus
                  </p>
                  <p className="mt-3 text-sm leading-6 text-white/65">
                    {healthReport.executiveFocus}
                  </p>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <MGDButton>
                  {executiveBriefing.nextBestActions[0]?.nextAction ??
                    healthReport.intelligence.nextBestAction}
                </MGDButton>
                <MGDButton variant="secondary">Abrir Priority Center</MGDButton>
              </div>
            </div>
          </div>

          <MGDWidget
            title="Company Pulse"
            eyebrow="Live operating pulse"
            status={healthReport.status}
            tone={healthReport.score >= 85 ? "success" : "warning"}
            className="bg-[#111A2E]/88"
          >
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-6xl font-bold tracking-tight">
                  {healthReport.score}
                </p>
                <p className="mt-2 text-sm font-semibold text-emerald-300">
                  {healthReport.summary}
                </p>
              </div>
              <Sparkline
                values={healthReport.healthBars.map((bar) => bar.score)}
              />
            </div>
            <div className="space-y-3">
              {healthReport.companyPulse.map((item) => (
                <MetricLine
                  key={item.label}
                  label={item.label}
                  value={item.value}
                  tone={item.tone}
                />
              ))}
            </div>
          </MGDWidget>
        </section>

        <section className="mb-6">
          <SectionHeader
            eyebrow="Executive KPI Cards"
            title="Performance snapshot"
            description="Indicadores executivos gerados pelo Business Health Engine para leitura imediata de tendencia."
          />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {healthReport.executiveKpis.map((kpi) => (
              <MGDWidget
                key={kpi.title}
                title={kpi.title}
                eyebrow={kpi.eyebrow}
                status={kpi.status}
                tone={kpi.tone}
                footer={kpi.footer}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-4xl font-semibold">{kpi.value}</div>
                    <p className="mt-3 text-sm text-white/55">{kpi.caption}</p>
                  </div>
                  <span className="mt-1 h-3 w-3 rounded-full bg-current text-emerald-300 shadow-[0_0_24px_currentColor]" />
                </div>
                <div className="mt-5">
                  <Sparkline values={kpi.trend} />
                </div>
              </MGDWidget>
            ))}
          </div>
        </section>

        <section className="mb-6">
          <SectionHeader
            eyebrow="Commerce Integration"
            title="Commerce Pulse"
            description="Snapshot comercial consolidado por adapter, pronto para trocar mock por banco ou API sem alterar a interface."
          />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {commerceKpis.map((kpi) => (
              <MGDWidget
                key={kpi.title}
                title={kpi.title}
                eyebrow={kpi.eyebrow}
                status={kpi.status}
                tone={kpi.tone}
                footer={kpi.footer}
              >
                <div className="text-4xl font-semibold">{kpi.value}</div>
                <p className="mt-3 text-sm text-white/55">{kpi.caption}</p>
                <div className="mt-5">
                  <Sparkline values={[...kpi.trend]} />
                </div>
              </MGDWidget>
            ))}
          </div>
        </section>

        <section className="mb-6 grid gap-5 xl:grid-cols-[.85fr_1.15fr]">
          <MGDWidget
            title="VIP Customers"
            eyebrow="Customer metrics"
            status={`${commerceSnapshot.metrics.customers.vipCustomers} VIP`}
            tone="primary"
            footer="Clientes de maior valor vindos do Commerce Snapshot."
          >
            <div className="space-y-3">
              <MetricLine
                label="Clientes ativos"
                value={commerceSnapshot.metrics.customers.activeCustomers}
                tone="success"
              />
              <MetricLine
                label="Novos clientes"
                value={commerceSnapshot.metrics.customers.newCustomers}
                tone="info"
              />
              <MetricLine
                label="Clientes VIP"
                value={commerceSnapshot.metrics.customers.vipCustomers}
                tone="primary"
              />
              <MetricLine
                label="Receita mensal"
                value={`R$ ${commerceSnapshot.metrics.revenue.month.toLocaleString("pt-BR")}`}
                tone="success"
              />
            </div>
          </MGDWidget>

          <MGDWidget
            title="Sales Channels"
            eyebrow="Channel performance"
            status={`${commerceSnapshot.metrics.salesChannels.length} canais`}
            tone="info"
            footer="Canais calculados por receita e participacao no snapshot."
          >
            <div className="space-y-4">
              {commerceSnapshot.metrics.salesChannels.map((channel) => (
                <div
                  key={channel.channel}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                >
                  <div className="mb-3 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-white">
                        {channel.channel}
                      </p>
                      <p className="mt-1 text-sm text-white/45">
                        {channel.orders} pedidos / R${" "}
                        {channel.revenue.toLocaleString("pt-BR")}
                      </p>
                    </div>
                    <MGDBadge tone={channel.share >= 30 ? "success" : "info"}>
                      {channel.share}%
                    </MGDBadge>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-[#6D5DFC] to-emerald-300"
                      style={{ width: `${channel.share}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </MGDWidget>
        </section>

        <section className="mb-6 grid gap-5 xl:grid-cols-[1.05fr_.95fr]">
          <MGDWidget
            title="Live Activity"
            eyebrow="Realtime event bus"
            status={`${liveActivity.length} events`}
            tone="success"
            footer="Atividade consolidada do barramento interno do MGD OS."
          >
            <div className="space-y-4">
              {liveActivity.map((event) => (
                <div
                  key={event.id}
                  className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:grid-cols-[64px_1fr_auto]"
                >
                  <span className="text-sm font-semibold text-white/40">
                    {event.time}
                  </span>
                  <div>
                    <p className="font-semibold text-white">{event.title}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/35">
                      {event.source} / {event.eventType}
                    </p>
                  </div>
                  <div className="sm:text-right">
                    <MGDBadge tone={priorityTone[event.priority]}>
                      {event.priority}
                    </MGDBadge>
                  </div>
                </div>
              ))}
            </div>
          </MGDWidget>

          <MGDWidget
            title="Notification Center"
            eyebrow="Reusable notifications"
            status={`${notifications.length} active`}
            tone="primary"
            footer="Centro preparado para receber eventos de Commerce, Finance, CRM e futuros modulos."
          >
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.035] p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-white">
                        {notification.title}
                      </p>
                      <p className="mt-1 text-sm text-white/45">
                        {notification.origin} / {notification.time}
                      </p>
                    </div>
                    <MGDBadge tone={priorityTone[notification.priority]}>
                      {notification.priority}
                    </MGDBadge>
                  </div>
                </div>
              ))}
            </div>
          </MGDWidget>
        </section>

        <section className="mb-6 grid gap-5 xl:grid-cols-[.78fr_1.22fr]">
          <MGDWidget
            title="Business Health"
            eyebrow="Calculated health bars"
            status={`${healthReport.healthBars.length} areas`}
            tone="primary"
            footer="Leitura consolidada pelo motor desacoplado de saude empresarial."
          >
            <div className="space-y-4">
              {healthReport.healthBars.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-semibold text-white/75">
                      {item.label}
                    </span>
                    <span className="text-sm font-semibold text-white">
                      {item.score}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className={`h-2 rounded-full bg-gradient-to-r ${healthToneStyles[item.tone]}`}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                  <p className="mt-3 text-xs leading-5 text-white/42">
                    {item.recommendation}
                  </p>
                </div>
              ))}
            </div>
          </MGDWidget>

          <MGDWidget
            title="MGD Intelligence"
            eyebrow="Executive digital director"
            status={`${executiveBriefing.confidence}% confidence`}
            tone="info"
            footer="Briefing executivo gerado pela Intelligence Layer a partir do Business Health Engine."
          >
            <div className="grid gap-5 lg:grid-cols-[1.05fr_.95fr]">
              <div>
                <div className="rounded-[24px] border border-white/10 bg-white/[0.035] p-5">
                  <MGDBadge tone="primary">
                    {executiveBriefing.greeting}
                  </MGDBadge>
                  <p className="mt-4 text-sm leading-6 text-white/62">
                    {executiveBriefing.summary}
                  </p>
                  <p className="mt-4 text-sm leading-6 text-white/48">
                    {executiveBriefing.diagnosis}
                  </p>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {executiveBriefing.priorities.slice(0, 2).map((priority) => (
                    <div
                      key={priority.id}
                      className="rounded-2xl border border-white/10 bg-white/[0.035] p-4"
                    >
                      <MGDBadge tone={priority.tone}>
                        {priority.relatedArea}
                      </MGDBadge>
                      <p className="mt-4 font-semibold text-white">
                        {priority.title}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-white/55">
                        {priority.description}
                      </p>
                      <p className="mt-3 text-xs font-semibold text-white/40">
                        {priority.impact}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-[24px] border border-[#6D5DFC]/20 bg-[#6D5DFC]/10 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-200">
                    Executive briefing
                  </p>
                  <div className="mt-5 space-y-3">
                    <MetricLine
                      label="AI confidence"
                      value={`${executiveBriefing.confidence}%`}
                      tone="success"
                    />
                    <MetricLine
                      label="Expected impact"
                      value={executiveBriefing.expectedImpact}
                      tone="primary"
                    />
                    <MetricLine
                      label="Risks"
                      value={executiveBriefing.risks.length}
                      tone={
                        executiveBriefing.risks.length > 0
                          ? "warning"
                          : "success"
                      }
                    />
                    <MetricLine
                      label="Opportunities"
                      value={executiveBriefing.opportunities.length}
                      tone="info"
                    />
                  </div>
                </div>

                {executiveBriefing.risks.slice(0, 1).map((risk) => (
                  <div
                    key={risk.id}
                    className="rounded-2xl border border-rose-400/15 bg-rose-400/10 p-4"
                  >
                    <MGDBadge tone={risk.tone}>Risk summary</MGDBadge>
                    <p className="mt-4 font-semibold text-white">
                      {risk.title}
                    </p>
                    <p className="mt-4 text-sm leading-6 text-white/60">
                      {risk.description}
                    </p>
                  </div>
                ))}

                {executiveBriefing.opportunities
                  .slice(0, 1)
                  .map((opportunity) => (
                    <div
                      key={opportunity.id}
                      className="rounded-2xl border border-emerald-400/15 bg-emerald-400/10 p-4"
                    >
                      <MGDBadge tone={opportunity.tone}>
                        Opportunity summary
                      </MGDBadge>
                      <p className="mt-4 font-semibold text-white">
                        {opportunity.title}
                      </p>
                      <p className="mt-4 text-sm leading-6 text-white/60">
                        {opportunity.description}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </MGDWidget>
        </section>

        <section className="mb-6 grid gap-5 xl:grid-cols-[1.05fr_.95fr]">
          <MGDWidget
            title="Executive Timeline"
            eyebrow="Trends and signals"
            status="Live"
            tone="success"
            footer="Linha do tempo executiva gerada a partir das tendencias calculadas."
          >
            <div className="space-y-4">
              {healthReport.trends.map((item) => (
                <div
                  key={item.id}
                  className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:grid-cols-[72px_1fr_auto]"
                >
                  <span className="text-sm font-semibold text-white/40">
                    {item.time}
                  </span>
                  <div>
                    <p className="font-semibold text-white">{item.title}</p>
                    <p className="mt-1 text-sm leading-6 text-white/52">
                      {item.detail}
                    </p>
                  </div>
                  <div className="sm:text-right">
                    <MGDBadge tone={item.tone}>{item.direction}</MGDBadge>
                  </div>
                </div>
              ))}
            </div>
          </MGDWidget>

          <MGDWidget
            title="Priority Center"
            eyebrow="Recommendations"
            status={`${healthReport.recommendations.length} active`}
            tone="warning"
            footer="Prioridades ordenadas por impacto financeiro e risco."
          >
            <div className="space-y-4">
              {executiveBriefing.recommendations.map((priority, index) => (
                <div
                  key={priority.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.035] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#6D5DFC]/20 text-sm font-bold text-violet-200">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-semibold text-white">
                          {priority.title}
                        </p>
                        <p className="mt-1 text-sm text-white/50">
                          {priority.impact}
                        </p>
                        <p className="mt-2 text-xs leading-5 text-white/40">
                          {priority.description}
                        </p>
                      </div>
                    </div>
                    <MGDBadge tone={priority.tone}>
                      {priority.relatedArea}
                    </MGDBadge>
                  </div>
                </div>
              ))}
            </div>
          </MGDWidget>
        </section>

        <section className="mb-6 grid gap-5 xl:grid-cols-[.9fr_1.1fr]">
          <MGDWidget
            title="Business Alerts"
            eyebrow="Risk and opportunity"
            status={`${healthReport.alerts.length} active`}
            tone={healthReport.alerts.length > 0 ? "danger" : "success"}
            footer="Alertas filtrados para decisao executiva."
          >
            <div className="space-y-4">
              {healthReport.alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.035] p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-white">{alert.title}</p>
                    <MGDBadge tone={alert.tone}>Alert</MGDBadge>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-white/55">
                    {alert.detail}
                  </p>
                </div>
              ))}
            </div>
          </MGDWidget>

          <MGDWidget
            title="Quick Actions"
            eyebrow="Executive shortcuts"
            status="Ready"
            tone="primary"
            footer="Acoes de alto impacto geradas a partir das recomendacoes."
          >
            <div className="grid gap-3 sm:grid-cols-2">
              {executiveBriefing.nextBestActions.map((action) => (
                <button
                  key={action.id}
                  className="min-h-14 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left text-sm font-semibold text-white/72 transition duration-300 hover:border-[#6D5DFC]/40 hover:bg-[#6D5DFC]/12 hover:text-white"
                >
                  {action.nextAction}
                </button>
              ))}
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
