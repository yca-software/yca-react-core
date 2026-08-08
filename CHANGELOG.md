# Changelog

## Unreleased

## 0.0.14 — 2026-08-08

### Fixed

- **DateRangePicker trigger** — use `h-9` (same as `Input` / `MultiSelect` / `DatePicker`) so toolbar filters align.

## 0.0.12 — 2026-08-01

### Added

- **`useAccessTokenKeepAlive`** (`/api`) — interval + visibility/focus refresh when the access JWT is missing or near expiry. Apps pass `enabled` + `getAccessToken`.

## 0.0.11 — 2026-08-01

### Fixed

- **API client refresh** — single-flight `/auth/refresh` so parallel 401 retries share one request; treat HTTP 429 and 5xx as transient (do not call `onFailure` / clear the SPA session).

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
