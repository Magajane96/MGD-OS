import type { CompanyState, MGDEvent } from "@mgd/types";

export interface EventBus {
  publish<TPayload>(event: MGDEvent<TPayload>): Promise<void>;
  subscribe(type: string, handler: (event: MGDEvent) => void | Promise<void>): () => void;
}

export interface CompanyStateReader {
  getState(companyId: string): Promise<CompanyState> | CompanyState;
}

export interface MGDContext {
  eventBus: EventBus;
  companyState: CompanyStateReader;
}
