# yca-react-core — architecture

`@yca-software/yca-react-core` is the shared React library for **YCA stack** consumers (`yca-web`, `yca-landing`). It parallels `@yca-software/2chi-react-core` for the legacy 2chi stack — not a drop-in replacement unless explicitly migrated.

## Package boundaries

| In the package | In the app (yca-web) |
| -------------- | -------------------- |
| UI primitives, marketing blocks, SPA shells | Routes, pages, modals |
| HTTP client kit (`createApiProvider`, `useAPI`) | `providers/ApiProvider.tsx`, env, zustand |
| Error resolution mechanism | `helpers/error.ts` + `i18n.t` + sonner |
| Cookie name helpers | `helpers/cookie.ts` with `VITE_APP_NAME` |
| Admin list/detail page shells | Data hooks, permissions, navigation |
| Theme CSS tokens | App theme store wiring |

**Must not** live here: TanStack Query resource hooks, zustand stores, PostHog, Paddle checkout flows, app locales (`errors.json`), permission string constants.

## Source layout

```
src/
  api/           # createApiProvider, useAPI, refresh helpers — no env binding
  auth/          # Cookie helpers, session types, JWT decode utilities
  errors/        # resolveApiError, toast helpers — accepts t() from app
  constants/     # createCookieNames, shared non-permission constants
  hooks/         # useAdminListPage, useTranslationNamespace (generic)
  lib/           # cn(), dates, pagination, surfaces
  types/         # Shared DTO shapes (ApiErrorBody, AccessInfo, …)
  admin/         # Admin route helpers (detail error kind, etc.)
  components/
    ui/          # Radix + cva primitives (Button, Input, Dialog, …)
    spa/         # PageLoader, RouteSuspense, QueryState, AdminListPage, ThemeProvider
    marketing/   # Hero, PricingSection, Navigation, ProjectLaunches, …
    forms/       # RHF field wrappers (EmailField, PermissionsField, …)
  theme/         # Design tokens (shipped via styles.css)
```

## Subpath imports (preferred)

Use **`package.json` exports** — avoid deep imports into `dist/` paths.

| Import | Use for |
| ------ | ------- |
| `@yca-software/yca-react-core/ui` | Button, Input, Card, Dialog, Tooltip, … |
| `@yca-software/yca-react-core/spa` | PageLoader, RouteSuspense, QueryState, AdminListPage, ThemeProvider |
| `@yca-software/yca-react-core/marketing` | Navigation, HeroSplit, PricingSection, ProjectLaunches |
| `@yca-software/yca-react-core/forms` | EmailField, PermissionsField, FormDrawer fields |
| `@yca-software/yca-react-core/api` | createApiProvider, useAPI, executeConfiguredRefresh |
| `@yca-software/yca-react-core/auth` | getRefreshTokenFromCookies, session types |
| `@yca-software/yca-react-core/errors` | resolveApiError, formatMutationError |
| `@yca-software/yca-react-core/constants` | createCookieNames |
| `@yca-software/yca-react-core/hooks` | useAdminListPage, useTranslationNamespace |
| `@yca-software/yca-react-core/lib` | cn(), date helpers |
| `@yca-software/yca-react-core/admin` | getAdminDetailErrorKind |
| `@yca-software/yca-react-core/styles.css` | Theme tokens + base styles |

The root barrel (`@yca-software/yca-react-core`) re-exports all subpaths for convenience — **yca-web should prefer subpaths** for clearer boundaries and smaller mental model.

## Consumer wiring pattern

The library exposes **mechanisms**; apps bind environment and i18n:

```tsx
// yca-web/src/providers/ApiProvider.tsx
createApiProvider({ baseURL: import.meta.env.VITE_API_URL, ... })

// yca-web/src/helpers/error.ts
resolveApiError(error, extra, (key, opts) => i18n.t(key, opts))

// yca-web/src/helpers/cookie.ts
createCookieNames(import.meta.env.VITE_APP_NAME, import.meta.env.VITE_APP_ENV)
```

## Styling

Consumers import `@yca-software/yca-react-core/styles.css` and configure Tailwind to scan `node_modules/@yca-software/yca-react-core/dist/**/*.{js,mjs}`.

Override brand colors via CSS variables on `:root` / `.dark` — do not fork component class strings.

## Testing

- Vitest + RTL for non-trivial components and kit modules
- Storybook for UI and marketing blocks
- Run `pnpm run ci` before publish
