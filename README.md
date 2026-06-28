# MGD OS — Project TITAN

Sistema operacional empresarial da MGD Systems.

## Sprint atual

Sprint 003 — MGD Design Language 1.0.

## Rodar localmente

```bash
pnpm install
pnpm --filter @mgd/command dev
```

Abra:

```bash
http://localhost:3000
```

## Estrutura

```text
apps/
  command/       Digital Mission Control
  commerce/      Commerce Center
packages/
  design-system/ Tokens oficiais do MGD OS
  ui/            Componentes reutilizáveis
  widgets/       Widgets de negócio
  kernel/        Base futura do OS
  business-brain/ Inteligência de negócio
  advisor/       Advisor executivo
```
