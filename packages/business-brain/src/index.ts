import type { CompanyState } from "@mgd/types";

export function generateExecutiveSummary(state: CompanyState): string {
  return `Business Health ${state.health.score}/100. ${state.health.summary}`;
}
