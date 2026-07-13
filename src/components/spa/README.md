# SPA components

Shared product-SPA patterns (admin lists, loaders, query shells, settings rows). Import from `@yca-software/yca-react-core/spa`.

Pair with `@yca-software/yca-react-core/hooks` (`useAdminListPage`) and `@yca-software/yca-react-core/ui` primitives.

## Layout

Same folder contract as UI/marketing — **implementation in `index.tsx`** (or `index.ts` for factories), stories and tests colocated.

```text
spa/<name>/
  index.tsx
  <name>.stories.tsx
  <name>.test.tsx   # when behavior is non-trivial
```

## Blocks (12 exported)

| Folder | Role |
|--------|------|
| `admin-list-page` | Search + table + infinite scroll |
| `admin-detail-page` | Back link, loading/error shell |
| `audit-log-list-filters` | Audit log toolbar filters |
| `create-bound-query-state` | i18n/error binding factory for `QueryState` |
| `date-range-filter` | Labeled `DateRangePicker` for lists |
| `detail-field-list` | Label/value grid for detail views |
| `entity-row` | Settings entity list row |
| `page-loader` | Loading spinner variants |
| `query-state` | TanStack Query loading/error wrapper |
| `route-suspense` | Lazy route Suspense boundary |
| `theme-provider` | Document `light`/`dark` class |
| `theme-toggle` | Theme switch control |

## Peer dependencies

Components that need app wiring declare peers on the package:

- `react-router` — `AdminDetailPage`
- `react-i18next` — `PageLoader` default label
- `@tanstack/react-query` — `useAdminListPage` hook

## Cross-imports

```ts
import { PageLoader } from '../page-loader';
import { Button, Card } from '../../ui';
import { cn } from '../../../lib/utils';
```

## Development

```bash
pnpm storybook   # SPA/* stories (+ SPA/Overview catalog)
pnpm test:run    # component + hook tests (useAdminListPage, pagination)
```
