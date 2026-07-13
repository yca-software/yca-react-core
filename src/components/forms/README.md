# Form fields

Generic React Hook Form field wrappers built on `@yca-software/yca-react-core/ui` primitives.

**Peer:** `react-hook-form`

## Fields

| Component | Purpose |
| --------- | ------- |
| `EmailField` | Email input |
| `PasswordField` | Password input (optional `rightLabel` slot) |
| `FirstNameField` / `LastNameField` | Name inputs with autocomplete |
| `NameField` | Generic text name |
| `DescriptionField` | Textarea |
| `ExpiresAtField` | Select for expiry options |
| `RoleSelectField` | Role dropdown (`RoleOption[]`) |
| `PermissionsField` | Grouped permission checkboxes (`PermissionGroup[]`, `t` callback) |

Import from `@yca-software/yca-react-core/forms`.

Apps pass labels, permission groups, and locale keys — the library does not bundle permission strings or `errors.json`.

## Layout

One folder per field; implementation in `index.tsx`. Co-locate tests (e.g. `permissions-field/permissions-field.test.tsx`).
