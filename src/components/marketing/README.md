# Marketing components

Layout and content blocks for landing/marketing pages. Import from `@yca-software/yca-react-core/marketing`.

Requires `@yca-software/yca-react-core/styles.css` (includes `ds-mkt-*` utilities from `src/theme/marketing.css`).

## Layout

Same folder contract as UI components — **implementation in `index.tsx`**, stories and tests colocated.

```text
marketing/<name>/
  index.tsx
  <name>.stories.tsx
  <name>.test.tsx   # when behavior is non-trivial
```

## Styling

- Use `ds-mkt-*` classes for marketing-specific gradients, meshes, and CTA treatments.
- Shared controls (buttons, inputs, cards) come from `../../ui/*` — do not duplicate primitives.
- Theme tokens from `src/theme/tokens.css`; override in apps via CSS variables.

## Cross-imports

```ts
import { cn } from '../../../lib/utils';
import { Button } from '../../ui/button';
```

Stories import the component from `'.'`.

## Blocks (23 exported)

`bento-features`, `blog-teaser`, `contact-section`, `cta-banner`, `error-spotlight`, `faq-section`, `feature-media`, `footer`, `hero`, `hero-split`, `logo-cloud`, `navigation`, `newsletter`, `pricing-section`, `project-launches`, `promo-banner`, `section`, `service-card`, `stats-strip`, `team-grid`, `testimonial`, `trust-badges`, `video-showcase`

Each has a colocated `*.stories.tsx`. **Marketing/Overview → All blocks** composes the full set on one page.

## Development

```bash
pnpm storybook   # Marketing/* stories
pnpm test:run
```
