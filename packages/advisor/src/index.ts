import {
  generateBusinessHealthReport,
  type BusinessHealthReport,
  type BusinessRiskSeverity,
  type BusinessSignalTone,
} from "@mgd/business-brain";
import { publishEvent } from "@mgd/events";
import type { CompanyState } from "@mgd/types";

export type AdvisorSeverity = BusinessRiskSeverity;

export interface AdvisorPriority {
  id: string;
  title: string;
  description: string;
  severity: AdvisorSeverity;
  confidence: number;
  impact: string;
  nextAction: string;
  relatedArea: string;
  createdAt: string;
  tone: BusinessSignalTone;
}

export interface AdvisorRecommendation {
  id: string;
  title: string;
  description: string;
  severity: AdvisorSeverity;
  confidence: number;
  impact: string;
  nextAction: string;
  relatedArea: string;
  createdAt: string;
  tone: BusinessSignalTone;
}

export interface AdvisorAction {
  id: string;
  title: string;
  description: string;
  severity: AdvisorSeverity;
  confidence: number;
  impact: string;
  nextAction: string;
  relatedArea: string;
  createdAt: string;
  tone: BusinessSignalTone;
}

export interface AdvisorRisk {
  id: string;
  title: string;
  description: string;
  severity: AdvisorSeverity;
  confidence: number;
  impact: string;
  nextAction: string;
  relatedArea: string;
  createdAt: string;
  tone: BusinessSignalTone;
}

export interface AdvisorOpportunity {
  id: string;
  title: string;
  description: string;
  severity: AdvisorSeverity;
  confidence: number;
  impact: string;
  nextAction: string;
  relatedArea: string;
  createdAt: string;
  tone: BusinessSignalTone;
}

export interface AdvisorBriefing {
  id: string;
  greeting: string;
  summary: string;
  diagnosis: string;
  confidence: number;
  expectedImpact: string;
  priorities: AdvisorPriority[];
  recommendations: AdvisorRecommendation[];
  risks: AdvisorRisk[];
  opportunities: AdvisorOpportunity[];
  nextBestActions: AdvisorAction[];
  createdAt: string;
}

export interface AdvisorBriefingOptions {
  createdAt?: string;
  greeting?: string;
  executiveName?: string;
}

const DEFAULT_CREATED_AT = "business-health-report";

const severityRank: Record<AdvisorSeverity, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

const normalizeConfidence = (value: number) =>
  Math.max(0, Math.min(100, Math.round(value)));

const sortBySeverityAndConfidence = <
  T extends { severity: AdvisorSeverity; confidence: number },
>(
  items: T[],
) =>
  [...items].sort((a, b) => {
    const severityDelta = severityRank[b.severity] - severityRank[a.severity];
    return severityDelta === 0 ? b.confidence - a.confidence : severityDelta;
  });

const describeStatus = (report: BusinessHealthReport) => {
  if (report.score >= 90) {
    return "A empresa opera em modo de crescimento com saude executiva forte.";
  }

  if (report.score >= 78) {
    return "A empresa esta em crescimento controlado, com pontos de atencao administraveis.";
  }

  return "A empresa exige atencao executiva antes de escalar novas iniciativas.";
};

export function generateExecutiveDiagnosis(
  report: BusinessHealthReport,
): string {
  const strongestArea = [...report.healthBars].sort(
    (a, b) => b.score - a.score,
  )[0];
  const weakestArea = [...report.healthBars].sort(
    (a, b) => a.score - b.score,
  )[0];
  const highestRisk = [...report.risks].sort((a, b) => b.score - a.score)[0];

  return [
    describeStatus(report),
    `A area mais forte e ${strongestArea?.label ?? "operacao"} com score ${strongestArea?.score ?? report.score}.`,
    `O principal ponto de pressao e ${weakestArea?.label ?? "risco operacional"} com score ${weakestArea?.score ?? report.score}.`,
    highestRisk
      ? `O risco prioritario e ${highestRisk.title.toLowerCase()}: ${highestRisk.recommendation}`
      : "Nao ha risco critico ativo no momento.",
  ].join(" ");
}

export function generatePriorityRecommendations(
  report: BusinessHealthReport,
  options: AdvisorBriefingOptions = {},
): AdvisorRecommendation[] {
  const createdAt = options.createdAt ?? DEFAULT_CREATED_AT;

  return sortBySeverityAndConfidence(
    report.recommendations.map((recommendation) => ({
      id: `advisor-${recommendation.id}`,
      title: recommendation.title,
      description: recommendation.detail,
      severity: recommendation.priority,
      confidence: normalizeConfidence(recommendation.confidence),
      impact: recommendation.impact,
      nextAction: recommendation.action,
      relatedArea: recommendation.owner,
      createdAt,
      tone: recommendation.tone,
    })),
  );
}

export function generateRiskSummary(
  report: BusinessHealthReport,
  options: AdvisorBriefingOptions = {},
): AdvisorRisk[] {
  const createdAt = options.createdAt ?? DEFAULT_CREATED_AT;

  return sortBySeverityAndConfidence(
    report.risks.map((risk) => ({
      id: `advisor-${risk.id}`,
      title: risk.title,
      description: risk.recommendation,
      severity: risk.severity,
      confidence: normalizeConfidence(
        Math.max(report.intelligence.confidence, risk.score),
      ),
      impact: risk.impact,
      nextAction: risk.recommendation,
      relatedArea: risk.owner,
      createdAt,
      tone: risk.tone,
    })),
  );
}

export function generateOpportunitySummary(
  report: BusinessHealthReport,
  options: AdvisorBriefingOptions = {},
): AdvisorOpportunity[] {
  const createdAt = options.createdAt ?? DEFAULT_CREATED_AT;
  const revenueKpi = report.executiveKpis.find(
    (kpi) => kpi.title === "Receita",
  );
  const customerKpi = report.executiveKpis.find(
    (kpi) => kpi.title === "Clientes",
  );
  const confidence = normalizeConfidence(report.intelligence.confidence - 4);

  return [
    {
      id: "advisor-growth-opportunity",
      title: "Sustentar crescimento com controle operacional",
      description:
        "O motor identifica oportunidade de manter crescimento sem abrir mao de margem e SLA.",
      severity: report.score >= 90 ? "high" : "medium",
      confidence,
      impact: revenueKpi?.footer ?? "Aumenta previsibilidade de receita.",
      nextAction: report.intelligence.nextBestAction,
      relatedArea: "Executive",
      createdAt,
      tone: "success",
    },
    {
      id: "advisor-customer-opportunity",
      title: "Ativar motion de clientes de maior valor",
      description:
        "A saude comercial indica espaco para oferta direcionada ao segmento premium.",
      severity: "medium",
      confidence: normalizeConfidence(confidence - 3),
      impact: customerKpi?.footer ?? "Eleva recompra e eficiencia comercial.",
      nextAction: "Ativar campanha VIP",
      relatedArea: "Marketing",
      createdAt,
      tone: "primary",
    },
  ];
}

export function generateNextBestActions(
  report: BusinessHealthReport,
  options: AdvisorBriefingOptions = {},
): AdvisorAction[] {
  const createdAt = options.createdAt ?? DEFAULT_CREATED_AT;
  const recommendations = generatePriorityRecommendations(report, options);

  return recommendations.map((recommendation, index) => ({
    id: `advisor-action-${index + 1}`,
    title: recommendation.nextAction,
    description: recommendation.description,
    severity: recommendation.severity,
    confidence: recommendation.confidence,
    impact: recommendation.impact,
    nextAction: recommendation.nextAction,
    relatedArea: recommendation.relatedArea,
    createdAt,
    tone: recommendation.tone,
  }));
}

export function generateExecutiveBriefing(
  report: BusinessHealthReport,
  options: AdvisorBriefingOptions = {},
): AdvisorBriefing {
  const createdAt = options.createdAt ?? DEFAULT_CREATED_AT;
  const executiveName = options.executiveName ?? "Francisco";
  const greeting = options.greeting ?? `Bom dia, ${executiveName}.`;
  const recommendations = generatePriorityRecommendations(report, {
    ...options,
    createdAt,
  });
  const risks = generateRiskSummary(report, { ...options, createdAt });
  const opportunities = generateOpportunitySummary(report, {
    ...options,
    createdAt,
  });
  const nextBestActions = generateNextBestActions(report, {
    ...options,
    createdAt,
  });
  const diagnosis = generateExecutiveDiagnosis(report);
  const primaryImpact =
    recommendations[0]?.impact ??
    report.intelligence.model.find((item) => item.label === "Revenue upside")
      ?.value ??
    "Impacto sob avaliacao";

  const briefing: AdvisorBriefing = {
    id: "advisor-executive-briefing",
    greeting,
    summary: `${report.summary} ${report.executiveFocus}`,
    diagnosis,
    confidence: normalizeConfidence(report.intelligence.confidence),
    expectedImpact: primaryImpact,
    priorities: recommendations.map((recommendation) => ({
      ...recommendation,
      id: recommendation.id.replace("advisor-", "advisor-priority-"),
    })),
    recommendations,
    risks,
    opportunities,
    nextBestActions,
    createdAt,
  };

  publishEvent({
    id: `recommendation-generated-${briefing.id}-${briefing.createdAt}`,
    type: "RecommendationGenerated",
    source: "Advisor",
    priority: briefing.risks.some((risk) => risk.severity === "critical")
      ? "critical"
      : briefing.risks.some((risk) => risk.severity === "high")
        ? "high"
        : "normal",
    title: "Nova recomendacao executiva",
    payload: {
      briefingId: briefing.id,
      summary: briefing.summary,
      confidence: briefing.confidence,
      expectedImpact: briefing.expectedImpact,
      nextBestAction:
        briefing.nextBestActions[0]?.nextAction ?? "Acompanhar operacao",
    },
  });

  return briefing;
}

export function createAdvisorMessage(state: CompanyState): string {
  const report = generateBusinessHealthReport(state);
  const briefing = generateExecutiveBriefing(report);
  const action =
    briefing.nextBestActions[0]?.nextAction ?? "acompanhar a operacao";

  return `${briefing.greeting} ${briefing.summary} Proxima acao recomendada: ${action}.`;
}
