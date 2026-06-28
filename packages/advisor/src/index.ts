import type { CompanyState } from "@mgd/types";

export function createAdvisorMessage(state: CompanyState): string {
  const priority = state.health.priorities[0] ?? "acompanhar a operacao";
  return `Bom dia, Francisco. Sua empresa esta com saude ${state.health.score}/100. Proxima acao recomendada: ${priority}.`;
}
