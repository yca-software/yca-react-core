# Changelog

## Unreleased

## 0.0.1 — 2026-07-13

### Changed

- **Default theme** — soft-neutral warm gray palette, `--radius: 0.75rem`, subtle borders (`--border-subtle`), token-based shadows.
- **Bugfix** — base layer no longer wraps OKLCH tokens in `oklch()` (fixes harsh/black default borders).
- **UI styling** — inputs, buttons, cards, overlays, and tables use `lib/surfaces.ts` fragments.
- **Typography** — `Heading` / `Paragraph` use theme foreground tokens (removed hardcoded `slate-*`).
- **date-range-picker** — public API in `index.tsx`; implementation in `DateRangePicker.tsx`.
- **CSS layout** — tokens in `src/theme/tokens.css`; marketing utilities in `src/theme/marketing.css`.

### Added

- **Kit modules** — `api/`, `auth/`, `errors/`, `constants/`, `admin/`, `types/`; subpath exports mirror `@yca-software/2chi-react-core`.
- **Form fields** — nine RHF wrappers under `components/forms/`; export `@yca-software/yca-react-core/forms`.
- **`useTranslationNamespace`** — on-demand i18n namespace loader hook (app injects `loadNamespace`).
- **`js-cookie`**, **`jwt-decode`** — dependencies for auth cookie/JWT helpers.
- **Marketing components** — 22 blocks migrated from `2chi-react-core` plus `ProjectLaunches`; export `@yca-software/yca-react-core/marketing`.
- **SPA components** — admin pages, loaders, query shells, entity rows, filters, theme; export `@yca-software/yca-react-core/spa`.
- **`useAdminListPage` hook** — infinite admin list helper; `lib/pagination`, `lib/dateRangePickerTranslations`. Storybook **Marketing/Overview** catalogs all blocks.
- `lib/surfaces.ts` — shared `controlBase`, `surfaceCard`, `surfaceOverlay`, etc.
- Storybook **Foundation/Theme** docs page and light/dark toolbar.
- UI authoring guide in `src/components/ui/README.md`.
- Storybook `parameters.docs.description` on all component stories.

### Notes for consumers

- Import path unchanged: `@yca-software/yca-react-core/styles.css`.
- Visual defaults changed; override CSS variables if you relied on the previous blue-tinted theme.
- No breaking React prop/API changes.
