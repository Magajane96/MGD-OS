import type { EventInput, MGDRealtimeEventType } from "@mgd/events";
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
  actions: [
    { label: "Ver prioridades", href: "#priorities", intent: "primary" },
  ],
};

export type OrderStatus =
  | "created"
  | "paid"
  | "processing"
  | "fulfilled"
  | "cancelled";

export type CommerceChannel =
  | "Online Store"
  | "Instagram"
  | "WhatsApp"
  | "Marketplace"
  | "POS";

export type CustomerSegment = "standard" | "vip" | "enterprise";

export interface OrderLineItem {
  productId: string;
  sku: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  status: OrderStatus;
  total: number;
  channel: CommerceChannel;
  createdAt: string;
  items: OrderLineItem[];
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  segment: CustomerSegment;
  lifetimeValue: number;
  lastOrderAt: string;
}

export interface RevenueMetrics {
  today: number;
  week: number;
  month: number;
  averageTicket: number;
  conversionRate: number;
}

export interface InventoryMetrics {
  totalProducts: number;
  totalStock: number;
  criticalProducts: Product[];
  criticalStockCount: number;
}

export interface CustomerMetrics {
  activeCustomers: number;
  newCustomers: number;
  vipCustomers: number;
}

export interface CommerceMetrics {
  revenue: RevenueMetrics;
  ordersCount: number;
  pendingOrders: number;
  inventory: InventoryMetrics;
  customers: CustomerMetrics;
  salesChannels: Array<{
    channel: CommerceChannel;
    revenue: number;
    orders: number;
    share: number;
  }>;
}

export interface CommerceSnapshot {
  id: string;
  generatedAt: string;
  orders: Order[];
  products: Product[];
  customers: Customer[];
  metrics: CommerceMetrics;
}

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const REFERENCE_NOW = new Date("2026-06-28T10:45:00-03:00");

const sum = (values: number[]) =>
  values.reduce((total, value) => total + value, 0);

const roundCurrency = (value: number) => Math.round(value * 100) / 100;

const isWithinDays = (date: string, days: number, now = REFERENCE_NOW) =>
  now.getTime() - new Date(date).getTime() <= days * DAY_IN_MS;

const isToday = (date: string, now = REFERENCE_NOW) =>
  new Date(date).toDateString() === now.toDateString();

const mapOrderEventStatus = (
  status: OrderStatus,
): "created" | "updated" | "paid" | "fulfilled" => {
  if (status === "created" || status === "paid" || status === "fulfilled") {
    return status;
  }

  return "updated";
};

export const demoProducts: Product[] = [
  {
    id: "prod-001",
    name: "Produto X",
    sku: "SKU-PRODUTO-X",
    price: 289,
    stock: 7,
    category: "Core",
  },
  {
    id: "prod-002",
    name: "Produto Premium Black",
    sku: "SKU-PREMIUM-BLACK",
    price: 549,
    stock: 11,
    category: "Premium",
  },
  {
    id: "prod-003",
    name: "Kit Executivo",
    sku: "SKU-KIT-EXEC",
    price: 842,
    stock: 34,
    category: "Bundle",
  },
  {
    id: "prod-004",
    name: "Assinatura VIP",
    sku: "SKU-SUB-VIP",
    price: 1290,
    stock: 100,
    category: "Subscription",
  },
];

export const demoCustomers: Customer[] = [
  {
    id: "cus-001",
    name: "Ana Martins",
    email: "ana@example.com",
    segment: "vip",
    lifetimeValue: 18420,
    lastOrderAt: "2026-06-28T09:12:00-03:00",
  },
  {
    id: "cus-002",
    name: "Bruno Lima",
    email: "bruno@example.com",
    segment: "standard",
    lifetimeValue: 2340,
    lastOrderAt: "2026-06-28T10:21:00-03:00",
  },
  {
    id: "cus-003",
    name: "Carolina Souza",
    email: "carolina@example.com",
    segment: "enterprise",
    lifetimeValue: 42800,
    lastOrderAt: "2026-06-27T16:48:00-03:00",
  },
  {
    id: "cus-004",
    name: "Diego Rocha",
    email: "diego@example.com",
    segment: "vip",
    lifetimeValue: 12680,
    lastOrderAt: "2026-06-28T08:44:00-03:00",
  },
];

export const demoOrders: Order[] = [
  {
    id: "ord-1048",
    customerId: "cus-002",
    customerName: "Bruno Lima",
    status: "created",
    total: 842,
    channel: "Instagram",
    createdAt: "2026-06-28T10:21:00-03:00",
    items: [
      {
        productId: "prod-003",
        sku: "SKU-KIT-EXEC",
        name: "Kit Executivo",
        quantity: 1,
        unitPrice: 842,
      },
    ],
  },
  {
    id: "ord-1047",
    customerId: "cus-001",
    customerName: "Ana Martins",
    status: "paid",
    total: 1839,
    channel: "Online Store",
    createdAt: "2026-06-28T09:12:00-03:00",
    items: [
      {
        productId: "prod-002",
        sku: "SKU-PREMIUM-BLACK",
        name: "Produto Premium Black",
        quantity: 1,
        unitPrice: 549,
      },
      {
        productId: "prod-004",
        sku: "SKU-SUB-VIP",
        name: "Assinatura VIP",
        quantity: 1,
        unitPrice: 1290,
      },
    ],
  },
  {
    id: "ord-1046",
    customerId: "cus-004",
    customerName: "Diego Rocha",
    status: "processing",
    total: 1156,
    channel: "WhatsApp",
    createdAt: "2026-06-28T08:44:00-03:00",
    items: [
      {
        productId: "prod-001",
        sku: "SKU-PRODUTO-X",
        name: "Produto X",
        quantity: 4,
        unitPrice: 289,
      },
    ],
  },
  {
    id: "ord-1042",
    customerId: "cus-003",
    customerName: "Carolina Souza",
    status: "fulfilled",
    total: 2679,
    channel: "Marketplace",
    createdAt: "2026-06-27T16:48:00-03:00",
    items: [
      {
        productId: "prod-003",
        sku: "SKU-KIT-EXEC",
        name: "Kit Executivo",
        quantity: 2,
        unitPrice: 842,
      },
      {
        productId: "prod-001",
        sku: "SKU-PRODUTO-X",
        name: "Produto X",
        quantity: 1,
        unitPrice: 289,
      },
      {
        productId: "prod-002",
        sku: "SKU-PREMIUM-BLACK",
        name: "Produto Premium Black",
        quantity: 1,
        unitPrice: 706,
      },
    ],
  },
];

export function createCommerceSnapshot({
  orders,
  products,
  customers,
  generatedAt = REFERENCE_NOW.toISOString(),
}: {
  orders: Order[];
  products: Product[];
  customers: Customer[];
  generatedAt?: string;
}): CommerceSnapshot {
  const now = new Date(generatedAt);
  const todayOrders = orders.filter((order) => isToday(order.createdAt, now));
  const weekOrders = orders.filter((order) =>
    isWithinDays(order.createdAt, 7, now),
  );
  const monthOrders = orders.filter((order) =>
    isWithinDays(order.createdAt, 30, now),
  );
  const todayRevenue = sum(todayOrders.map((order) => order.total));
  const allRevenue = sum(orders.map((order) => order.total));
  const pendingStatuses: OrderStatus[] = ["created", "paid", "processing"];
  const criticalProducts = products.filter((product) => product.stock <= 12);
  const activeCustomers = customers.filter((customer) =>
    isWithinDays(customer.lastOrderAt, 30, now),
  );
  const newCustomers = customers.filter((customer) =>
    isWithinDays(customer.lastOrderAt, 7, now),
  );
  const vipCustomers = customers.filter(
    (customer) =>
      customer.segment === "vip" || customer.segment === "enterprise",
  );
  const salesChannels = Array.from(
    new Set(orders.map((order) => order.channel)),
  ).map((channel) => {
    const channelOrders = orders.filter((order) => order.channel === channel);
    const revenue = sum(channelOrders.map((order) => order.total));

    return {
      channel,
      revenue,
      orders: channelOrders.length,
      share: allRevenue === 0 ? 0 : Math.round((revenue / allRevenue) * 100),
    };
  });

  return {
    id: "commerce-snapshot-demo",
    generatedAt,
    orders,
    products,
    customers,
    metrics: {
      revenue: {
        today: roundCurrency(todayRevenue),
        week: roundCurrency(sum(weekOrders.map((order) => order.total))),
        month: roundCurrency(sum(monthOrders.map((order) => order.total))),
        averageTicket:
          orders.length === 0 ? 0 : roundCurrency(allRevenue / orders.length),
        conversionRate: Math.round((6.2 + todayOrders.length * 0.4) * 10) / 10,
      },
      ordersCount: orders.length,
      pendingOrders: orders.filter((order) =>
        pendingStatuses.includes(order.status),
      ).length,
      inventory: {
        totalProducts: products.length,
        totalStock: sum(products.map((product) => product.stock)),
        criticalProducts,
        criticalStockCount: criticalProducts.length,
      },
      customers: {
        activeCustomers: activeCustomers.length,
        newCustomers: newCustomers.length,
        vipCustomers: vipCustomers.length,
      },
      salesChannels,
    },
  };
}

export function generateCommerceEvents(snapshot: CommerceSnapshot) {
  const events: Array<EventInput<MGDRealtimeEventType>> = [];
  const latestOrder = [...snapshot.orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )[0];

  if (latestOrder) {
    events.push({
      id: `commerce-order-${latestOrder.id}`,
      type: latestOrder.status === "created" ? "OrderCreated" : "OrderUpdated",
      timestamp: latestOrder.createdAt,
      source: "Commerce Center",
      priority: latestOrder.status === "created" ? "normal" : "high",
      title:
        latestOrder.status === "created"
          ? "Novo pedido criado"
          : "Pedido atualizado",
      payload: {
        orderId: latestOrder.id,
        total: latestOrder.total,
        customerId: latestOrder.customerId,
        status: mapOrderEventStatus(latestOrder.status),
      },
    });
  }

  for (const product of snapshot.metrics.inventory.criticalProducts) {
    events.push({
      id: `commerce-inventory-${product.sku}`,
      type: "InventoryChanged",
      timestamp: snapshot.generatedAt,
      source: "Commerce Center",
      priority: product.stock <= 8 ? "critical" : "high",
      title: "Estoque entrou em alerta",
      payload: {
        sku: product.sku,
        productName: product.name,
        previousQuantity: product.stock + 11,
        currentQuantity: product.stock,
        threshold: 12,
      },
    });

    events.push({
      id: `commerce-alert-${product.sku}`,
      type: "AlertRaised",
      timestamp: snapshot.generatedAt,
      source: "Commerce Center",
      priority: product.stock <= 8 ? "critical" : "high",
      title: `Estoque critico: ${product.name}`,
      payload: {
        alertId: `alert-${product.sku}`,
        title: `Estoque critico: ${product.name}`,
        description: `${product.name} esta abaixo do estoque de seguranca.`,
        severity: product.stock <= 8 ? "critical" : "high",
        relatedArea: "Inventory",
      },
    });
  }

  for (const customer of snapshot.customers.filter((item) =>
    isToday(item.lastOrderAt, new Date(snapshot.generatedAt)),
  )) {
    events.push({
      id: `commerce-customer-${customer.id}`,
      type: "CustomerCreated",
      timestamp: customer.lastOrderAt,
      source: "Commerce Center",
      priority: customer.segment === "standard" ? "normal" : "high",
      title: "Cliente ativo identificado",
      payload: {
        customerId: customer.id,
        name: customer.name,
        segment: customer.segment,
      },
    });
  }

  return events;
}

export const demoCommerceSnapshot = createCommerceSnapshot({
  orders: demoOrders,
  products: demoProducts,
  customers: demoCustomers,
});
