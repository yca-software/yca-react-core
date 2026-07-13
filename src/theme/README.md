# Theme

CSS consumed via `@yca-software/yca-react-core/styles.css`.

| File | Purpose |
|------|---------|
| `tokens.css` | Design tokens (`:root` / `.dark`), Tailwind `@theme` mapping, base `body` styles |
| `marketing.css` | Optional `ds-mkt-*` utilities for landing pages (same bundle today) |

## Override in your app

```css
:root {
  --radius: 0.875rem;
  --primary: oklch(0.35 0.03 85);
  --border: oklch(0.88 0.006 85);
}
```

See package README and Storybook **Foundation → Theme** for the full variable list.

## UI component styling

React primitives use `lib/surfaces.ts` class fragments wired to these tokens. Prefer overriding variables over forking component classes.
