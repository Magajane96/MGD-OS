export type MGDId = string;

export type HealthStatus = "excellent" | "healthy" | "attention" | "critical";

export interface BusinessHealth {
  score: number;
  status: HealthStatus;
  summary: string;
  priorities: string[];
}

export interface CompanyState {
  companyId: MGDId;
  updatedAt: string;
  health: BusinessHealth;
  commerce: {
    revenueToday: number;
    revenueTrendPercent: number;
    ordersWaiting: number;
    inventoryRisk: string[];
  };
  timeline: Array<{
    id: MGDId;
    time: string;
    title: string;
    description?: string;
  }>;
}

export type EventPriority = "critical" | "high" | "normal" | "low";

export interface MGDEvent<TPayload = unknown> {
  id: MGDId;
  type: string;
  version: number;
  companyId: MGDId;
  userId?: MGDId;
  timestamp: string;
  source: string;
  priority: EventPriority;
  payload: TPayload;
  metadata?: Record<string, unknown>;
  correlationId?: MGDId;
  causationId?: MGDId;
}

export interface WidgetAction {
  label: string;
  href?: string;
  intent?: "primary" | "secondary" | "danger";
}

export interface WidgetManifest {
  id: string;
  name: string;
  category: "executive" | "commerce" | "finance" | "customer" | "intelligence";
  events: string[];
  actions: WidgetAction[];
}
