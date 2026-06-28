export type MGDRealtimeEventType =
  | "OrderCreated"
  | "OrderUpdated"
  | "InventoryChanged"
  | "CustomerCreated"
  | "PaymentReceived"
  | "BusinessHealthUpdated"
  | "RecommendationGenerated"
  | "AlertRaised"
  | "NotificationCreated";

export type MGDRealtimePriority = "low" | "normal" | "high" | "critical";

export interface CommerceOrderPayload {
  orderId: string;
  total: number;
  customerId?: string;
  status: "created" | "updated" | "paid" | "fulfilled";
}

export interface InventoryChangedPayload {
  sku: string;
  productName: string;
  previousQuantity: number;
  currentQuantity: number;
  threshold: number;
}

export interface CustomerCreatedPayload {
  customerId: string;
  name: string;
  segment: "standard" | "vip" | "enterprise";
}

export interface PaymentReceivedPayload {
  paymentId: string;
  orderId: string;
  amount: number;
  method: "pix" | "credit_card" | "boleto" | "cash" | "other";
}

export interface BusinessHealthUpdatedPayload {
  score: number;
  status: string;
  summary: string;
  operatingMode: string;
  riskCount: number;
}

export interface RecommendationGeneratedPayload {
  briefingId: string;
  summary: string;
  confidence: number;
  expectedImpact: string;
  nextBestAction: string;
}

export interface AlertRaisedPayload {
  alertId: string;
  title: string;
  description: string;
  severity: MGDRealtimePriority;
  relatedArea: string;
}

export interface NotificationCreatedPayload {
  notificationId: string;
  title: string;
  description: string;
  priority: MGDRealtimePriority;
  origin: string;
}

export interface MGDRealtimePayloadMap {
  OrderCreated: CommerceOrderPayload;
  OrderUpdated: CommerceOrderPayload;
  InventoryChanged: InventoryChangedPayload;
  CustomerCreated: CustomerCreatedPayload;
  PaymentReceived: PaymentReceivedPayload;
  BusinessHealthUpdated: BusinessHealthUpdatedPayload;
  RecommendationGenerated: RecommendationGeneratedPayload;
  AlertRaised: AlertRaisedPayload;
  NotificationCreated: NotificationCreatedPayload;
}

export type MGDRealtimePayload<TType extends MGDRealtimeEventType> =
  MGDRealtimePayloadMap[TType];

export interface MGDRealtimeEvent<TType extends MGDRealtimeEventType> {
  id: string;
  type: TType;
  timestamp: string;
  source: string;
  priority: MGDRealtimePriority;
  title: string;
  payload: MGDRealtimePayload<TType>;
}

export type AnyMGDRealtimeEvent = {
  [TType in MGDRealtimeEventType]: MGDRealtimeEvent<TType>;
}[MGDRealtimeEventType];

export type EventHandler<TType extends MGDRealtimeEventType> = (
  event: MGDRealtimeEvent<TType>,
) => void | Promise<void>;

export type AnyEventHandler = (
  event: AnyMGDRealtimeEvent,
) => void | Promise<void>;

export interface EventInput<TType extends MGDRealtimeEventType> {
  id?: string;
  type: TType;
  timestamp?: string;
  source: string;
  priority?: MGDRealtimePriority;
  title: string;
  payload: MGDRealtimePayload<TType>;
}

export interface EventNotification {
  id: string;
  title: string;
  time: string;
  priority: MGDRealtimePriority;
  origin: string;
  eventType: MGDRealtimeEventType;
}

export interface LiveActivityItem {
  id: string;
  time: string;
  title: string;
  source: string;
  priority: MGDRealtimePriority;
  eventType: MGDRealtimeEventType;
}

const EVENT_HISTORY_LIMIT = 100;

const handlers = new Map<MGDRealtimeEventType, Set<AnyEventHandler>>();
const wildcardHandlers = new Set<AnyEventHandler>();
const eventHistory: AnyMGDRealtimeEvent[] = [];

let eventSequence = 0;
let commandCenterSimulationSeeded = false;

const createEventId = (type: MGDRealtimeEventType) => {
  eventSequence += 1;
  return `${type}-${eventSequence.toString().padStart(4, "0")}`;
};

const normalizeEventTime = (date = new Date()) => date.toISOString();

const formatEventTime = (timestamp: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));

export function createEvent<TType extends MGDRealtimeEventType>(
  input: EventInput<TType>,
): MGDRealtimeEvent<TType> {
  return {
    id: input.id ?? createEventId(input.type),
    type: input.type,
    timestamp: input.timestamp ?? normalizeEventTime(),
    source: input.source,
    priority: input.priority ?? "normal",
    title: input.title,
    payload: input.payload,
  };
}

export function getEventHistory(limit = EVENT_HISTORY_LIMIT) {
  return eventHistory.slice(0, limit);
}

export function clearEventHistory() {
  eventHistory.splice(0, eventHistory.length);
  commandCenterSimulationSeeded = false;
}

function isRealtimeEvent<TType extends MGDRealtimeEventType>(
  input: EventInput<TType> | MGDRealtimeEvent<TType>,
): input is MGDRealtimeEvent<TType> {
  return (
    typeof input.id === "string" &&
    typeof input.timestamp === "string" &&
    typeof input.priority === "string"
  );
}

export function publishEvent<TType extends MGDRealtimeEventType>(
  input: EventInput<TType> | MGDRealtimeEvent<TType>,
): MGDRealtimeEvent<TType> {
  const event = isRealtimeEvent(input) ? input : createEvent(input);
  const historyEvent = event as AnyMGDRealtimeEvent;
  const existingIndex = eventHistory.findIndex((item) => item.id === event.id);

  if (existingIndex >= 0) {
    eventHistory.splice(existingIndex, 1);
  }

  eventHistory.unshift(historyEvent);

  if (eventHistory.length > EVENT_HISTORY_LIMIT) {
    eventHistory.splice(EVENT_HISTORY_LIMIT);
  }

  const eventHandlers = handlers.get(event.type) ?? new Set<AnyEventHandler>();

  for (const handler of [...eventHandlers, ...wildcardHandlers]) {
    void handler(historyEvent);
  }

  return event;
}

export function subscribe<TType extends MGDRealtimeEventType>(
  type: TType,
  handler: EventHandler<TType>,
) {
  const eventHandlers = handlers.get(type) ?? new Set<AnyEventHandler>();
  eventHandlers.add(handler as AnyEventHandler);
  handlers.set(type, eventHandlers);

  return () => unsubscribe(type, handler);
}

export function subscribeAll(handler: AnyEventHandler) {
  wildcardHandlers.add(handler);
  return () => unsubscribeAll(handler);
}

export function unsubscribe<TType extends MGDRealtimeEventType>(
  type: TType,
  handler: EventHandler<TType>,
) {
  const eventHandlers = handlers.get(type);
  eventHandlers?.delete(handler as AnyEventHandler);

  if (eventHandlers?.size === 0) {
    handlers.delete(type);
  }
}

export function unsubscribeAll(handler: AnyEventHandler) {
  wildcardHandlers.delete(handler);
}

export class InMemoryEventBus {
  subscribe<TType extends MGDRealtimeEventType>(
    type: TType,
    handler: EventHandler<TType>,
  ) {
    return subscribe(type, handler);
  }

  subscribeAll(handler: AnyEventHandler) {
    return subscribeAll(handler);
  }

  publish<TType extends MGDRealtimeEventType>(
    input: EventInput<TType> | MGDRealtimeEvent<TType>,
  ) {
    return publishEvent(input);
  }

  history(limit?: number) {
    return getEventHistory(limit);
  }
}

export function toLiveActivity(event: AnyMGDRealtimeEvent): LiveActivityItem {
  return {
    id: event.id,
    time: formatEventTime(event.timestamp),
    title: event.title,
    source: event.source,
    priority: event.priority,
    eventType: event.type,
  };
}

export function toNotification(event: AnyMGDRealtimeEvent): EventNotification {
  return {
    id: `notification-${event.id}`,
    title: event.title,
    time: formatEventTime(event.timestamp),
    priority: event.priority,
    origin: event.source,
    eventType: event.type,
  };
}

export function getLiveActivity(limit = 8) {
  return getEventHistory(limit).map(toLiveActivity);
}

export function getNotifications(limit = 6) {
  return getEventHistory(limit).map(toNotification);
}

export function seedCommandCenterEvents() {
  if (commandCenterSimulationSeeded) {
    return getEventHistory();
  }

  commandCenterSimulationSeeded = true;
  const today = new Date();
  const at = (hour: number, minute: number) => {
    const date = new Date(today);
    date.setHours(hour, minute, 0, 0);
    return date.toISOString();
  };

  publishEvent({
    id: "sim-order-created",
    type: "OrderCreated",
    timestamp: at(10, 21),
    source: "Commerce Center",
    priority: "normal",
    title: "Novo pedido criado",
    payload: {
      orderId: "ORD-1048",
      total: 842,
      customerId: "CUS-128",
      status: "created",
    },
  });

  publishEvent({
    id: "sim-business-health-updated",
    type: "BusinessHealthUpdated",
    timestamp: at(10, 24),
    source: "Business Brain",
    priority: "high",
    title: "Business Health atualizado",
    payload: {
      score: 90,
      status: "healthy",
      summary: "Empresa em modo de crescimento controlado.",
      operatingMode: "Controlled growth",
      riskCount: 2,
    },
  });

  publishEvent({
    id: "sim-recommendation-generated",
    type: "RecommendationGenerated",
    timestamp: at(10, 27),
    source: "Advisor",
    priority: "high",
    title: "Nova recomendacao executiva",
    payload: {
      briefingId: "advisor-executive-briefing",
      summary: "Priorizar reposicao antes de escalar campanha.",
      confidence: 91,
      expectedImpact: "Protege R$ 18k em receita",
      nextBestAction: "Abrir plano de reposicao",
    },
  });

  publishEvent({
    id: "sim-inventory-alert",
    type: "InventoryChanged",
    timestamp: at(10, 31),
    source: "Operations Center",
    priority: "critical",
    title: "Estoque entrou em alerta",
    payload: {
      sku: "SKU-PRODUTO-X",
      productName: "Produto X",
      previousQuantity: 18,
      currentQuantity: 7,
      threshold: 10,
    },
  });

  return getEventHistory();
}
