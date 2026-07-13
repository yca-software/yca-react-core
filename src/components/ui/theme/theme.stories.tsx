import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../card';
import { Input } from '../input';

const meta = {
  title: 'Foundation/Theme',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Default soft-neutral theme shipped with yca-react-core. Override CSS variables in your app global stylesheet after importing `styles.css`. Components read tokens via Tailwind (`bg-background`, `border-border`, etc.) and `lib/surfaces.ts` fragments.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const tokenRows = [
  { name: '--background', utility: 'bg-background' },
  { name: '--foreground', utility: 'text-foreground' },
  { name: '--card', utility: 'bg-card' },
  { name: '--primary', utility: 'bg-primary' },
  { name: '--secondary', utility: 'bg-secondary' },
  { name: '--muted', utility: 'bg-muted' },
  { name: '--accent', utility: 'bg-accent' },
  { name: '--border', utility: 'border-border' },
  { name: '--border-subtle', utility: 'border-border-subtle' },
  { name: '--input', utility: 'bg-input' },
  { name: '--ring', utility: 'ring-ring' },
  { name: '--destructive', utility: 'bg-destructive' },
  { name: '--radius', utility: 'rounded-lg (via --radius)' },
];

export const Tokens: Story = {
  render: () => (
    <div className="mx-auto max-w-3xl space-y-8">
      <section className="space-y-3">
        <h2 className="text-lg font-semibold tracking-tight">CSS variables</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Set these on <code className="text-xs">:root</code> or{' '}
          <code className="text-xs">.dark</code> in your app after importing{' '}
          <code className="text-xs">@yca-software/yca-react-core/styles.css</code>.
        </p>
        <div className="overflow-hidden rounded-xl border border-border/45">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/40 bg-muted/30 text-left">
                <th className="px-4 py-2 font-medium">Variable</th>
                <th className="px-4 py-2 font-medium">Tailwind</th>
              </tr>
            </thead>
            <tbody>
              {tokenRows.map((row) => (
                <tr key={row.name} className="border-b border-border/30 last:border-0">
                  <td className="px-4 py-2 font-mono text-xs">{row.name}</td>
                  <td className="px-4 py-2 text-muted-foreground">{row.utility}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold tracking-tight">Component preview</h2>
        <Card>
          <CardHeader>
            <CardTitle>Soft surfaces</CardTitle>
            <CardDescription>
              Borders use reduced opacity; controls use a light muted fill.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-end gap-3">
            <Input className="max-w-xs" placeholder="Email" />
            <Button>Primary</Button>
            <Button variant="outline">Outline</Button>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold tracking-tight">Override example</h2>
        <pre className="overflow-x-auto rounded-xl border border-border/45 bg-muted/25 p-4 text-xs leading-relaxed">
          {`:root {
  --radius: 0.875rem;
  --primary: oklch(0.35 0.03 85);
  --border: oklch(0.88 0.006 85);
}`}
        </pre>
      </section>
    </div>
  ),
};
