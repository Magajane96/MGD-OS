import type { WidgetManifest } from "@mgd/types";

export interface WidgetProps<TData = unknown> {
  data: TData;
  manifest: WidgetManifest;
}

export const businessHealthWidgetManifest: WidgetManifest = {
  id: "business-health",
  name: "Business Health",
  category: "executive",
  events: ["company.state.updated", "business.health.updated"],
  actions: [{ label: "Ver prioridades", href: "#priorities", intent: "primary" }],
};
