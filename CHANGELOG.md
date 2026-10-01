# Changelog

## Unreleased

## 0.0.22 — 2026-10-01

### Added

- **`SearchField`** (`/ui`) — submit-mode search control with clear + search actions; `AdminListPage` submit mode uses it.
- **`LabeledSelect`** (`/spa`) — label + `Select` filter control for toolbar filters.
- **`EventCalendar`** (`/ui`) — month/week/day event calendar.

### Fixed

- **Refresh cooldown** — after a transient `/auth/refresh` failure (429/5xx), pause new refresh attempts for 30s so the SPA cannot hammer the API.

## 0.0.17 — 2026-08-17

### Fixed

- **Keep-alive** — schedule refresh from JWT `exp` (capped at 4 minutes), including background tabs. A 10-minute interval skipped hidden tabs and let the 15-minute access JWT expire.
- **Hidden-tab refresh** — HTTP 400/401/403/404 from `/auth/refresh` while `document.hidden` do **not** call `onFailure`. Frozen/background fetches can omit cookies; logging out then is wrong. Retry when the tab is visible again.

## 0.0.16 — 2026-08-17

### Fixed

- **API 401 retry** — HttpOnly cookie sessions retry `/auth/refresh` even when `getRefreshToken()` is null (Zustand empty after a SPA reload/deploy). Previously those 401s never refreshed and the app logged the user out.
- **Refresh during rollouts** — `/auth/refresh` retries 429/5xx/network/invalid JSON a few times before giving up; still does **not** call `onFailure` for those. A missing JS refresh token also no longer calls `onFailure`.
- **`isInvalidSessionStatus`** (`/auth`) — only `404` (account gone). **401 on `/users/me` is not a logout** — the client refreshes instead.
- **`resolveApiRefreshToken`** (`/auth`) — shared HttpOnly marker vs public-route blind-refresh helper.

## 0.0.15 — 2026-08-14

### Fixed

- **Access token refresh** — network errors, aborted fetches, and invalid JSON no longer call `onFailure` (which logs the SPA out). Only HTTP 400/401/403/404 clear the session. `pageshow` also triggers keep-alive after iOS restores a frozen tab.
- **Access cookie** — `setAccessTokenCookie` sets `expires` from the JWT `exp` instead of a session cookie that iOS Safari drops when switching apps.
- **Select search** — Turkish letter folding so queries like `hektas` match `Hektaş`.

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
