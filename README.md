# @yca-software/yca-react-core

Shared React components and helpers for YCA apps.

## Install

```bash
pnpm add @yca-software/yca-react-core
```

Import styles once in your app entry:

```tsx
import '@yca-software/yca-react-core/styles.css';
```

**Peers:** `react`, `react-dom`, `react-hook-form`, `react-i18next`, `react-router`, `@tanstack/react-query`

## Usage

Prefer subpath imports:

```tsx
import { Button, Form } from '@yca-software/yca-react-core/ui';
import { Hero, Navigation, Footer } from '@yca-software/yca-react-core/marketing';
import { AdminListPage, PageLoader } from '@yca-software/yca-react-core/spa';
import { EmailField, PermissionsField } from '@yca-software/yca-react-core/forms';
import { createApiProvider, useAPI } from '@yca-software/yca-react-core/api';
import { resolveApiError, formatApiError } from '@yca-software/yca-react-core/errors';
import { createCookieNames } from '@yca-software/yca-react-core/constants';
import { useAdminListPage, useTranslationNamespace } from '@yca-software/yca-react-core/hooks';
import { getAdminDetailErrorKind } from '@yca-software/yca-react-core/admin';
```

| Subpath | Contents |
|---------|----------|
| `/ui` | Radix + Tailwind UI primitives (~34 components) |
| `/marketing` | Landing page blocks (Hero, Navigation, PricingSection, …) |
| `/spa` | Admin lists, loaders, query shells, entity rows, theme |
| `/forms` | Generic RHF fields (EmailField, PermissionsField, …) |
| `/api` | HTTP client, `createApiProvider`, `useAPI`, 401 refresh |
| `/auth` | Cookie helpers, JWT decode |
| `/errors` | `resolveApiError`, `formatApiError`, mutation/query toast helpers |
| `/constants` | `createCookieNames`, pagination flatten helpers |
| `/admin` | `getAdminDetailErrorKind` |
| `/types` | Shared form/admin types (`RoleOption`, `PermissionGroup`, …) |
| `/hooks` | `useAdminListPage`, `useTranslationNamespace` |
| `/lib` | `cn`, dates, pagination, surfaces, radix overlays |
| `/styles.css` | Theme tokens + `ds-mkt-*` marketing utilities |

The root export re-exports all subpaths for convenience.

See component READMEs under `src/components/{ui,marketing,spa,forms}/`.

## Consumer wiring

The library provides **generic mechanisms**. Your SPA binds env, stores, and locales in a thin `src/helpers/` layer (same pattern as `templates/react-spa`):

```tsx
// helpers/error.ts — app owns i18n + toast
export function formatApiError(error: unknown) {
  return coreFormatApiError(error, i18n.t.bind(i18n));
}

// helpers/cookie.ts — app owns env
export const cookieNames = createCookieNames(APP_NAME, ENV);

// helpers/hooks/useTranslationNamespace.ts
export function useTranslationNamespace(ns: string | string[]) {
  return useCoreTranslationNamespace(ns, loadNamespace);
}
```

**Keep in the app, not the library:** routes, TanStack Query hooks per resource, zustand stores, `locales/**`, billing/Paddle, permission constants, PostHog.

## Theming

Import styles once, then override CSS variables in your global stylesheet:

```tsx
import '@yca-software/yca-react-core/styles.css';
```

```css
:root {
  --radius: 0.875rem;
  --primary: oklch(0.35 0.03 85);
  --border: oklch(0.88 0.006 85);
}

.dark {
  --background: oklch(0.14 0.01 85);
}
```

Key variables: `--background`, `--foreground`, `--card`, `--primary`, `--muted`, `--border`, `--border-subtle`, `--radius`, `--shadow-surface`, `--shadow-elevated`, `--font-sans`.

Browse **Foundation → Theme** in Storybook for a full table and live preview.

See [`CHANGELOG.md`](CHANGELOG.md) for visual default changes in the latest release.

## Development

```bash
pnpm install
pnpm run build
pnpm run ci
pnpm run storybook
```

## Adding modules

1. Add source under `src/components/`, `src/hooks/`, `src/lib/`, or kit folders (`api/`, `auth/`, …)
2. UI components: implement in `ui/<name>/index.tsx` (see `src/components/ui/README.md`)
3. Marketing blocks: implement in `marketing/<name>/index.tsx`
4. SPA patterns: implement in `spa/<name>/index.tsx`
5. Form fields: implement in `forms/<name>/index.tsx`
6. Add a `tsup` entry in `tsup.config.ts` if you add a new subpath
7. Add a matching `exports` entry in `package.json`

## Release

Publishing is automated when you [create a GitHub Release](https://github.com/yca-software/yca-react-core/releases/new):

1. Bump `version` in `package.json`
2. Commit and push to `main`
3. Tag `vX.Y.Z` and publish the release

CI runs build, lint, tests, then publishes to npm with `NPM_TOKEN`.
