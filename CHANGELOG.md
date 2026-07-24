# Changelog

## Unreleased

## 0.0.9 — 2026-07-24

### Fixed

- **DateRangePicker** — Apply with only one day selected treats that day as a single-day range (`from === to`) instead of requiring a second click.

## 0.0.8 — 2026-07-24

### Fixed

- **DateRangePicker** — mid widths (~640–1023px, e.g. ~780px) use a compact popover (one month + horizontal preset chips) instead of forcing a sidebar and two-month `min-w-[36rem]` panel that overflowed and looked broken.

## 0.0.7 — 2026-07-24

### Fixed

- **Popover / DateRangePicker** — keep overlays inside the viewport (`avoidCollisions`, `collisionPadding={16}`, `sticky="always"`). Wide date-range panels no longer clip off the left edge when the trigger sits near the screen edge.

## 0.0.6 — 2026-07-24

### Fixed

- **DateRangePicker** — restore `PopoverTrigger` with `forwardRef` on the trigger so Popper has a real anchor; set `side="bottom"` and `avoidCollisions={false}` so overflow shells cannot flip the panel to `translate(0, -200%)` off-screen. Keep `modal={false}`.

## 0.0.5 — 2026-07-24

### Fixed

- **DateRangePicker** — use `PopoverAnchor` instead of `PopoverTrigger` so controlled open is not toggled closed on click (editable trigger + icon).

## 0.0.4 — 2026-07-24

### Fixed

- **DateRangePicker** — popover uses `modal={false}` (match `DatePicker`) so clicking the editable trigger opens and stays open instead of dismissing under the modal focus trap; input click no longer races `PopoverTrigger` toggle.

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
