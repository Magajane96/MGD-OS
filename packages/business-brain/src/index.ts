import { publishEvent } from "@mgd/events";
import type { CompanyState, HealthStatus } from "@mgd/types";
import type { CommerceSnapshot } from "@mgd/widgets";

export type BusinessSignalTone =
  | "neutral"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "primary";

export type BusinessRiskSeverity = "low" | "medium" | "high" | "critical";
export type BusinessTrendDirection = "up" | "down" | "stable";

export interface BusinessHealthBar {
  label: string;
  score: number;
  tone: BusinessSignalTone;
  recommendation: string;
}

export interface ExecutiveKpi {
  title: string;
  eyebrow: string;
  status: string;
  value: string | number;
  caption: string;
  tone: BusinessSignalTone;
  trend: number[];
  footer: string;
}

export interface CompanyPulseSignal {
  label: string;
  value: string;
  tone: BusinessSignalTone;
}

export interface BusinessRisk {
  id: string;
  title: string;
  severity: BusinessRiskSeverity;
  score: number;
  impact: string;
  owner: string;
  recommendation: string;
  tone: BusinessSignalTone;
}

export interface BusinessTrend {
  id: string;
  time: string;
  title: string;
  detail: string;
  direction: BusinessTrendDirection;
  tone: BusinessSignalTone;
}

export interface BusinessRecommendation {
  id: string;
  title: string;
  detail: string;
  priority: BusinessRiskSeverity;
  owner: string;
  impact: string;
  confidence: number;
  action: string;
  tone: BusinessSignalTone;
}

export interface BusinessAlert {
  id: string;
  title: string;
  detail: string;
  tone: BusinessSignalTone;
}

export interface IntelligenceInsight {
  title: string;
  detail: string;
  tone: BusinessSignalTone;
}

export interface IntelligenceMetric {
  label: string;
  value: string;
  tone: BusinessSignalTone;
}

export interface BusinessHealthReport {
  score: number;
  status: HealthStatus;
  summary: string;
  operatingMode: string;
  executiveFocus: string;
  healthBars: BusinessHealthBar[];
  executiveKpis: ExecutiveKpi[];
  companyPulse: CompanyPulseSignal[];
  risks: BusinessRisk[];
  trends: BusinessTrend[];
  recommendations: BusinessRecommendation[];
  alerts: BusinessAlert[];
  intelligence: {
    confidence: number;
    nextBestAction: string;
    insights: IntelligenceInsight[];
    model: IntelligenceMetric[];
  };
  quickActions: string[];
}

export interface BusinessHealthReportOptions {
  commerceSnapshot?: CommerceSnapshot;
}

const clampScore = (value: number) =>
  Math.max(0, Math.min(100, Math.round(value)));

const average = (values: number[]) =>
  values.length === 0
    ? 0
    : Math.round(
        values.reduce((total, value) => total + value, 0) / values.length,
      );

const formatCurrency = (value: number) => `R$ ${value.toLocaleString("pt-BR")}`;

const statusFromScore = (score: number): HealthStatus => {
  if (score >= 95) return "excellent";
  if (score >= 82) return "healthy";
  if (score >= 65) return "attention";
  return "critical";
};

const toneFromScore = (score: number): BusinessSignalTone => {
  if (score >= 90) return "success";
  if (score >= 78) return "primary";
  if (score >= 65) return "warning";
  return "danger";
};

const severityFromScore = (score: number): BusinessRiskSeverity => {
  if (score >= 85) return "critical";
  if (score >= 65) return "high";
  if (score >= 40) return "medium";
  return "low";
};

const buildTrend = (start: number, end: number) => {
  const step = (end - start) / 6;
  return Array.from({ length: 7 }, (_, index) =>
    clampScore(start + step * index),
  );
};

export function calculateHealthBars(
  state: CompanyState,
  commerceSnapshot?: CommerceSnapshot,
): BusinessHealthBar[] {
  const trend = state.commerce.revenueTrendPercent;
  const pendingOrders =
    commerceSnapshot?.metrics.pendingOrders ?? state.commerce.ordersWaiting;
  const inventoryRisk =
    commerceSnapshot?.metrics.inventory.criticalStockCount ??
    state.commerce.inventoryRisk.length;
  const conversionRate =
    commerceSnapshot?.metrics.revenue.conversionRate ?? 7.8;

  const bars = [
    {
      label: "Financeiro",
      score: clampScore(
        commerceSnapshot
          ? 74 + commerceSnapshot.metrics.revenue.today / 900
          : 78 + trend,
      ),
      recommendation: "Preservar margem enquanto a receita acelera.",
    },
    {
      label: "Marketing",
      score: clampScore(74 + trend),
      recommendation:
        "Manter a campanha ativa enquanto o CAC estiver saudavel.",
    },
    {
      label: "Operacao",
      score: clampScore(100 - pendingOrders),
      recommendation: "Reduzir fila antes do proximo pico de demanda.",
    },
    {
      label: "Clientes",
      score: clampScore(
        commerceSnapshot
          ? 78 + commerceSnapshot.metrics.customers.vipCustomers * 4
          : 84 + trend / 2,
      ),
      recommendation: "Ativar recompra para clientes de maior valor.",
    },
    {
      label: "Estoque",
      score: clampScore(96 - inventoryRisk * 8),
      recommendation: "Repor SKUs criticos antes de escalar novas vendas.",
    },
    {
      label: "Conversao",
      score: clampScore(64 + conversionRate * 3),
      recommendation: "Acompanhar checkout e mix de oferta.",
    },
  ];

  return bars.map((bar) => ({ ...bar, tone: toneFromScore(bar.score) }));
}

export function calculateBusinessScore(healthBars: BusinessHealthBar[]) {
  const weights: Record<string, number> = {
    Financeiro: 1.25,
    Marketing: 0.9,
    Operacao: 1.1,
    Clientes: 1,
    Estoque: 1.15,
    Conversao: 0.8,
  };

  const weightedTotal = healthBars.reduce(
    (total, bar) => total + bar.score * (weights[bar.label] ?? 1),
    0,
  );
  const totalWeight = healthBars.reduce(
    (total, bar) => total + (weights[bar.label] ?? 1),
    0,
  );

  return clampScore(weightedTotal / totalWeight);
}

export function calculateBusinessRisks(
  state: CompanyState,
  commerceSnapshot?: CommerceSnapshot,
): BusinessRisk[] {
  const inventoryRiskScore = clampScore(
    (commerceSnapshot?.metrics.inventory.criticalStockCount ??
      state.commerce.inventoryRisk.length) * 38,
  );
  const pendingOrders =
    commerceSnapshot?.metrics.pendingOrders ?? state.commerce.ordersWaiting;
  const fulfillmentRiskScore = clampScore(pendingOrders * 4.5);
  const growthPressureScore = clampScore(
    (commerceSnapshot
      ? commerceSnapshot.metrics.revenue.conversionRate * 5
      : state.commerce.revenueTrendPercent * 3) +
      (commerceSnapshot?.metrics.inventory.criticalStockCount ??
        state.commerce.inventoryRisk.length) *
        10,
  );
  const leadProduct =
    commerceSnapshot?.metrics.inventory.criticalProducts[0]?.name ??
    state.commerce.inventoryRisk[0] ??
    "SKU principal";
  const revenueBase =
    commerceSnapshot?.metrics.revenue.today ?? state.commerce.revenueToday;

  return [
    {
      id: "inventory-risk",
      title: "Estoque critico",
      severity: severityFromScore(inventoryRiskScore),
      score: inventoryRiskScore,
      impact: `Protege ${formatCurrency(revenueBase * 0.38)} em receita potencial`,
      owner: "Operations",
      recommendation: `Repor ${leadProduct} antes de ampliar campanha.`,
      tone: inventoryRiskScore >= 65 ? "danger" : "warning",
    },
    {
      id: "fulfillment-risk",
      title: "Fila operacional",
      severity: severityFromScore(fulfillmentRiskScore),
      score: fulfillmentRiskScore,
      impact: "Preserva SLA e experiencia do cliente",
      owner: "Fulfillment",
      recommendation: `Priorizar separacao de ${pendingOrders} pedidos pendentes no proximo turno.`,
      tone: fulfillmentRiskScore >= 65 ? "danger" : "warning",
    },
    {
      id: "growth-pressure",
      title: "Pressao de crescimento",
      severity: severityFromScore(growthPressureScore),
      score: growthPressureScore,
      impact: "Evita crescimento com gargalo operacional",
      owner: "Executive",
      recommendation:
        "Manter crescimento, mas limitar ofertas com estoque sensivel.",
      tone: growthPressureScore >= 65 ? "warning" : "success",
    },
  ];
}

export function generateBusinessHealthReport(
  state: CompanyState,
  options: BusinessHealthReportOptions = {},
): BusinessHealthReport {
  const commerceSnapshot = options.commerceSnapshot;
  const healthBars = calculateHealthBars(state, commerceSnapshot);
  const score = calculateBusinessScore(healthBars);
  const status = statusFromScore(score);
  const risks = calculateBusinessRisks(state, commerceSnapshot);
  const highestRisk = [...risks].sort((a, b) => b.score - a.score)[0];
  const inventoryLeadItem =
    commerceSnapshot?.metrics.inventory.criticalProducts[0]?.name ??
    state.commerce.inventoryRisk[0] ??
    "SKU principal";
  const revenueToday =
    commerceSnapshot?.metrics.revenue.today ?? state.commerce.revenueToday;
  const pendingOrders =
    commerceSnapshot?.metrics.pendingOrders ?? state.commerce.ordersWaiting;
  const inventoryRiskCount =
    commerceSnapshot?.metrics.inventory.criticalStockCount ??
    state.commerce.inventoryRisk.length;
  const conversionRate =
    commerceSnapshot?.metrics.revenue.conversionRate ?? 7.8;
  const revenueUpside = Math.round(
    revenueToday * (state.commerce.revenueTrendPercent / 100),
  );
  const confidence = clampScore(
    average(healthBars.map((bar) => bar.score)) - risks.length * 2,
  );
  const operatingMode =
    score >= 90
      ? "Growth mode"
      : score >= 78
        ? "Controlled growth"
        : "Attention mode";
  const executiveFocus =
    highestRisk?.id === "inventory-risk"
      ? "Proteger estoque, manter crescimento e reduzir fila operacional."
      : "Preservar SLA, margem e cadencia comercial.";

  const recommendations: BusinessRecommendation[] = [
    {
      id: "restock-priority",
      title: `Repor ${inventoryLeadItem}`,
      detail: "Evita ruptura enquanto a receita segue acima do ritmo normal.",
      priority: highestRisk?.severity ?? "high",
      owner: "Operations",
      impact: `Protege ${formatCurrency(Math.max(revenueUpside, 12000))} em receita`,
      confidence,
      action: "Abrir plano de reposicao",
      tone: "danger",
    },
    {
      id: "fulfillment-priority",
      title: "Priorizar pedidos pendentes",
      detail: `${pendingOrders} pedidos precisam manter cadencia de separacao.`,
      priority: pendingOrders > 15 ? "high" : "medium",
      owner: "Fulfillment",
      impact: "Mantem SLA acima de 90%",
      confidence: clampScore(confidence - 4),
      action: "Priorizar fila de envio",
      tone: "warning",
    },
    {
      id: "vip-motion",
      title: "Ativar oferta VIP controlada",
      detail: "Aproveita crescimento sem expor produtos com estoque sensivel.",
      priority: "medium",
      owner: "Marketing",
      impact: "Sustenta crescimento com margem protegida",
      confidence: clampScore(confidence - 6),
      action: "Ativar campanha VIP",
      tone: "success",
    },
  ];

  const trends: BusinessTrend[] = [
    {
      id: "revenue-trend",
      time: "09:10",
      title: "Receita acelerou",
      detail: `Alta de ${state.commerce.revenueTrendPercent}% em relacao ao ritmo anterior, com ${formatCurrency(revenueToday)} capturados hoje.`,
      direction: state.commerce.revenueTrendPercent > 0 ? "up" : "stable",
      tone: "success",
    },
    {
      id: "inventory-trend",
      time: "09:35",
      title: "Estoque entrou em zona sensivel",
      detail: `${inventoryLeadItem} pode limitar vendas se a campanha continuar forte.`,
      direction: inventoryRiskCount > 0 ? "down" : "stable",
      tone: inventoryRiskCount > 0 ? "danger" : "success",
    },
    {
      id: "fulfillment-trend",
      time: "10:12",
      title: "Fila operacional monitorada",
      detail: `${pendingOrders} pedidos aguardam envio neste momento.`,
      direction: pendingOrders > 10 ? "down" : "stable",
      tone: pendingOrders > 10 ? "warning" : "success",
    },
    {
      id: "customer-trend",
      time: "10:40",
      title: "VIP motion disponivel",
      detail:
        "Segmento premium esta pronto para uma oferta com limite de estoque.",
      direction: "up",
      tone: "primary",
    },
  ];

  const alerts: BusinessAlert[] = risks
    .filter((risk) => risk.score >= 45)
    .map((risk) => ({
      id: `${risk.id}-alert`,
      title: risk.title,
      detail: risk.recommendation,
      tone: risk.tone,
    }));

  const report: BusinessHealthReport = {
    score,
    status,
    summary: `Business Health ${score}/100. ${state.health.summary}`,
    operatingMode,
    executiveFocus,
    healthBars,
    executiveKpis: [
      {
        title: "Receita",
        eyebrow: "Run rate",
        status: `+${state.commerce.revenueTrendPercent}%`,
        value: formatCurrency(revenueToday),
        caption: "capturado hoje",
        tone: "success",
        trend: buildTrend(
          34,
          clampScore(74 + state.commerce.revenueTrendPercent),
        ),
        footer: "Trajetoria calculada pelo Business Health Engine.",
      },
      {
        title: "Pedidos",
        eyebrow: "Fila ativa",
        status: `${pendingOrders} pendentes`,
        value: pendingOrders,
        caption: "aguardando envio",
        tone: pendingOrders > 10 ? "warning" : "success",
        trend: buildTrend(74, clampScore(74 - pendingOrders * 3)),
        footer: "Risco operacional ponderado pela fila atual.",
      },
      {
        title: "Clientes",
        eyebrow: "Pulso comercial",
        status: score >= 85 ? "Forte" : "Atencao",
        value: commerceSnapshot
          ? commerceSnapshot.metrics.customers.vipCustomers
          : `${clampScore(24 + state.commerce.revenueTrendPercent)}%`,
        caption: "propensao de recompra",
        tone: score >= 85 ? "success" : "warning",
        trend: buildTrend(
          28,
          clampScore(58 + state.commerce.revenueTrendPercent),
        ),
        footer: "Estimativa baseada em saude e crescimento.",
      },
      {
        title: "Estoque",
        eyebrow: "Risco",
        status: inventoryRiskCount > 0 ? "Critico" : "Seguro",
        value: inventoryRiskCount,
        caption: "SKUs sob atencao",
        tone: inventoryRiskCount > 0 ? "danger" : "success",
        trend: buildTrend(86, clampScore(86 - inventoryRiskCount * 28)),
        footer: "Score calculado por SKUs em risco.",
      },
    ],
    companyPulse: [
      {
        label: "Receita vs meta",
        value: commerceSnapshot
          ? `${clampScore(90 + commerceSnapshot.metrics.revenue.today / 1000)}%`
          : `${clampScore(94 + state.commerce.revenueTrendPercent)}%`,
        tone: "success",
      },
      {
        label: "Conversao checkout",
        value: `${conversionRate.toFixed(1)}%`,
        tone: "primary",
      },
      {
        label: "SLA separacao",
        value: `${clampScore(100 - pendingOrders * 0.75)}%`,
        tone: pendingOrders > 10 ? "warning" : "success",
      },
      {
        label: "Risco estoque",
        value: inventoryRiskCount > 0 ? "Alto" : "Baixo",
        tone: inventoryRiskCount > 0 ? "danger" : "success",
      },
      {
        label: "Modo operacional",
        value: operatingMode,
        tone: score >= 85 ? "success" : "warning",
      },
    ],
    risks,
    trends,
    recommendations,
    alerts,
    intelligence: {
      confidence,
      nextBestAction: recommendations[0]?.action ?? "Acompanhar operacao",
      insights: [
        {
          title: "Diagnostico",
          detail:
            "A empresa esta saudavel, mas o crescimento atual pressiona estoque e fulfillment.",
          tone: "info",
        },
        {
          title: "Risco principal",
          detail:
            highestRisk?.recommendation ?? "Nenhum risco critico no momento.",
          tone: highestRisk?.tone ?? "success",
        },
        {
          title: "Recomendacao",
          detail:
            recommendations[0]?.detail ?? "Manter monitoramento executivo.",
          tone: recommendations[0]?.tone ?? "primary",
        },
        {
          title: "Decisao sugerida",
          detail:
            "Executar a proxima melhor acao e revisar sinais no proximo turno.",
          tone: "success",
        },
      ],
      model: [
        { label: "Confidence", value: `${confidence}%`, tone: "success" },
        {
          label: "Revenue upside",
          value: formatCurrency(Math.max(revenueUpside, 9000)),
          tone: "primary",
        },
        {
          label: "Risk window",
          value: inventoryRiskCount > 0 ? "4 dias" : "Seguro",
          tone: inventoryRiskCount > 0 ? "warning" : "success",
        },
        {
          label: "Action urgency",
          value: highestRisk?.severity === "critical" ? "Alta" : "Media",
          tone: highestRisk?.tone ?? "neutral",
        },
      ],
    },
    quickActions: [
      recommendations[0]?.action ?? "Abrir plano executivo",
      recommendations[1]?.action ?? "Priorizar operacao",
      recommendations[2]?.action ?? "Ativar campanha VIP",
      "Gerar briefing executivo",
      "Ver risco por Center",
      "Sincronizar operacao",
    ],
  };

  publishEvent({
    id: `business-health-updated-${state.companyId}-${state.updatedAt}`,
    type: "BusinessHealthUpdated",
    source: "Business Brain",
    priority: risks.some((risk) => risk.severity === "critical")
      ? "critical"
      : risks.some((risk) => risk.severity === "high")
        ? "high"
        : "normal",
    title: "Business Health atualizado",
    payload: {
      score: report.score,
      status: report.status,
      summary: report.summary,
      operatingMode: report.operatingMode,
      riskCount: report.risks.length,
    },
  });

  return report;
}

export function generateExecutiveSummary(state: CompanyState): string {
  return generateBusinessHealthReport(state).summary;
}
