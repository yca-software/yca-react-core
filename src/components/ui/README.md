# UI components

Radix + Tailwind primitives for YCA apps. Import from `@yca-software/yca-react-core/ui`.

## Layout

Each component lives in its own folder. **Implementation and public exports live in `index.tsx`** (or `index.ts` for pure utilities).

```text
ui/<name>/
  index.tsx              # public API + composition
  types.ts               # optional — non-trivial props
  <name>.stories.tsx     # Storybook examples + docs
  <name>.test.tsx        # behavior tests
  *.ts                   # helpers (see date-range-picker/)
```

Multi-file example: `date-range-picker/` — `DateRangePicker.tsx` (state), `DateRangePickerTrigger.tsx`, `DateRangePickerPresetList.tsx`, etc.; `index.tsx` re-exports the public API.

**Internal building blocks** (not in root barrel): `inside-modal-scroll-lock`, `form-submit-button`.

## `index.tsx` section order

1. Imports — external → `lib/` → sibling UI → local `./`
2. Types — exported `*Props` with JSDoc on non-obvious fields
3. Variants / constants — `cva(...)` near the top
4. Private helpers
5. Components — private first, main export last
6. Exports — single block at bottom when practical

## Styling

- Shared shells: `lib/surfaces.ts` (`controlBase`, `surfaceCard`, `surfaceOverlay`, …)
- Theme tokens: `src/theme/tokens.css` (imported via `styles.css`)
- No hardcoded `slate-*`, hex, or raw `oklch` in components
- Override look in apps by setting CSS variables on `:root` / `.dark`

## Documentation

| Layer | Expectation |
|-------|-------------|
| Exported component | One-line JSDoc; point to Storybook title when useful |
| Storybook | `tags: ['autodocs']` + `parameters.docs.description.component` |
| Complex props | `types.ts` with JSDoc on non-obvious fields |

## When to split files

- `index.tsx` **> ~200 lines** or multiple distinct UI regions → extract private subcomponents (`Trigger.tsx`, `PresetList.tsx`, …)
- Do **not** use `<name>.tsx` + re-export `index.ts`

## Cross-imports

Stories, tests, and siblings import `from '../button'` or `from '.'` — both resolve to `index.tsx`.

## Development

```bash
pnpm storybook
pnpm test:run
```

If the sidebar shows only a few components, turn off Storybook’s **“Review new stories”** filter (disabled in `.storybook/main.ts` via `changeDetection: false`).

## Styles in consumer apps

```tsx
import '@yca-software/yca-react-core/styles.css';
```

See package README and Storybook **Foundation/Theme** for override examples.
