import type { Meta, StoryObj } from '@storybook/react';
import { ProjectLaunches } from '.';

const sampleProjects = [
  {
    name: 'Analytics dashboard',
    description: 'Ship funnels and cohort views without wiring charts from scratch.',
    href: '#',
    status: 'live' as const,
  },
  {
    name: 'Campaign API',
    description: 'REST + webhooks for teams automating outbound sequences.',
    href: '#',
    status: 'live' as const,
  },
  {
    name: 'Mobile companion',
    description: 'Review metrics on the go — native apps in private beta.',
    href: '#',
    status: 'coming-soon' as const,
  },
];

const meta = {
  title: 'Marketing/ProjectLaunches',
  component: ProjectLaunches,
  parameters: {
    docs: {
      description: {
        component: 'Product / project launch grid with live vs coming-soon status chips.',
      },
    },
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ProjectLaunches>;

export default meta;
type Story = StoryObj<typeof ProjectLaunches>;

export const Default: Story = {
  render: () => (
    <ProjectLaunches
      eyebrow="Shipped & upcoming"
      title="What we are building"
      liveLabel="Live"
      comingSoonLabel="Coming soon"
      projects={sampleProjects}
    />
  ),
};
