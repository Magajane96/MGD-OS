import type { CompanyState } from "@mgd/types";

export const demoCompanyState: CompanyState = {
  companyId: "company_mgd_demo",
  updatedAt: new Date().toISOString(),
  health: {
    score: 92,
    status: "healthy",
    summary: "Empresa saudavel, com crescimento de receita e atencao ao estoque.",
    priorities: ["Repor Produto X", "Separar 12 pedidos", "Manter campanha ativa"],
  },
  commerce: {
    revenueToday: 48420,
    revenueTrendPercent: 18,
    ordersWaiting: 12,
    inventoryRisk: ["Produto X", "Produto Premium Black"],
  },
  timeline: [
    {
      id: "1",
      time: "09:10",
      title: "Receita crescendo",
      description: "Alta de 18% em relacao a ontem.",
    },
    {
      id: "2",
      time: "09:35",
      title: "Estoque em atencao",
      description: "Produto X pode acabar em 4 dias.",
    },
    {
      id: "3",
      time: "10:12",
      title: "Pedidos aguardando envio",
      description: "12 pedidos precisam de separacao.",
    },
  ],
};
