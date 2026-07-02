# Corporate Assets

Sprint 009 introduces the first executive corporate asset registry for MGD OS.

The feature is intentionally scoped as an executive portfolio snapshot. It gives the Command Center a typed, reusable view of corporate assets without adding governance workflows, valuation logic, legal flows, compliance programs, or real integrations.

## Objective

Corporate Assets provides a first structured inventory of business-relevant assets that can be displayed inside the Command Center and evolved in future sprints.

The widget focuses on:

- Total assets
- Strategic assets
- Categories
- Integration readiness
- Owner
- Status
- Criticality
- Last update

## Architecture

The implementation follows the existing MGD OS package boundaries.

### `@mgd/types`

`packages/types/src/index.ts` owns the public contracts:

- `CorporateAssetCategory`
- `CorporateAssetStatus`
- `CorporateAssetCriticality`
- `CorporateAssetOwner`
- `CorporateAsset`
- `CorporateAssetPortfolioMetrics`
- `CorporateAssetPortfolioSnapshot`

These contracts are the only source of truth for Corporate Assets data shape.

### `@mgd/widgets`

`packages/widgets/src/index.ts` publishes:

- `corporateAssetsWidgetManifest`
- `demoCorporateAssets`
- `createCorporateAssetPortfolioSnapshot`
- `demoCorporateAssetPortfolio`
- label helpers for category, status, and criticality

The demo portfolio is deterministic and typed. It does not call external APIs, databases, SaaS tools, registries, or legal systems.

### Command Center

`apps/command/app/page.tsx` consumes Corporate Assets through the exported typed contracts from `@mgd/widgets`.

The page integrates:

- Executive KPI cards
- Corporate asset registry list
- Category distribution
- Portfolio summary
- Integration readiness summary
- Last update information

The Command Center does not own Corporate Assets data modeling. It only renders the snapshot provided by the widgets package.

## Data Model

### CorporateAssetCategory

Allowed categories:

- `brand`
- `domain`
- `system`
- `data`
- `process`
- `channel`
- `partnership`

### CorporateAsset

A corporate asset contains:

- `id`
- `name`
- `category`
- `description`
- `owner`
- `status`
- `criticality`
- `isStrategic`
- `integrationReadiness`
- `updatedAt`

### CorporateAssetPortfolioSnapshot

A portfolio snapshot contains:

- `id`
- `generatedAt`
- `owner`
- `assets`
- `metrics`

Metrics include:

- `totalAssets`
- `strategicAssets`
- `categories`
- `averageIntegrationReadiness`
- `statusDistribution`
- `criticalityDistribution`
- `lastUpdatedAt`

## Demo Portfolio

The demo portfolio includes assets across the main executive categories:

- MGD Systems Brand
- Command Center Domain
- Commerce Center
- Business Health Dataset
- Executive Briefing Process
- WhatsApp Sales Channel
- Template Partner Network

These assets are representative only. They are designed to validate the contract, UI, and executive reading experience.

## Explicit Non-Scope

Sprint 009 does not implement:

- Full governance
- Valuation
- Complete compliance
- Legal workflows
- Real integrations
- Asset lifecycle approvals
- External registry synchronization
- Financial accounting treatment

## Evolution Path

Future sprints can safely extend this foundation by adding:

- Real persistence
- Asset ownership workflows
- Governance layers
- Compliance overlays
- Valuation modules
- Legal document links
- Integration adapters
- Audit events

Those additions should preserve the existing public contracts or evolve them through explicit versioned fields.

## Validation

After applying the Sprint 009 files, run:

```bash
pnpm --filter @mgd/types build
pnpm --filter @mgd/widgets build
pnpm --filter @mgd/command build