import type { MGDEvent } from "@mgd/types";

export type EventHandler<TPayload = unknown> = (event: MGDEvent<TPayload>) => void | Promise<void>;

export class InMemoryEventBus {
  private handlers = new Map<string, Set<EventHandler>>();

  subscribe(type: string, handler: EventHandler): () => void {
    const handlers = this.handlers.get(type) ?? new Set<EventHandler>();
    handlers.add(handler);
    this.handlers.set(type, handlers);

    return () => handlers.delete(handler);
  }

  async publish<TPayload>(event: MGDEvent<TPayload>): Promise<void> {
    const handlers = this.handlers.get(event.type) ?? new Set<EventHandler>();
    const wildcardHandlers = this.handlers.get("*") ?? new Set<EventHandler>();

    await Promise.all([...handlers, ...wildcardHandlers].map((handler) => handler(event)));
  }
}

export function createEvent<TPayload>(input: Omit<MGDEvent<TPayload>, "id" | "timestamp" | "version"> & { version?: number }): MGDEvent<TPayload> {
  return {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    version: input.version ?? 1,
    ...input,
  };
}
