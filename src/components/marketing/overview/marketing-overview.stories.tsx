import type { Meta, StoryObj } from '@storybook/react';
import { Shield, Zap } from 'lucide-react';
import {
  BentoFeatures,
  BlogTeaser,
  ContactSection,
  CtaBanner,
  FaqSection,
  FeatureMedia,
  Footer,
  HeroSplit,
  LogoCloud,
  Navigation,
  Newsletter,
  PricingSection,
  ProjectLaunches,
  PromoBanner,
  Section,
  ServiceCard,
  StatsStrip,
  TeamGrid,
  Testimonial,
  TrustBadges,
  VideoShowcase,
} from '..';

const mockLogo = (
  <div className="flex items-center gap-2">
    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground">
      Y
    </div>
    <span className="font-semibold">YCA Software</span>
  </div>
);

const meta = {
  title: 'Marketing/Overview',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Catalog of all marketing blocks exported from `@yca-software/yca-react-core/marketing`. Each block has its own story under **Marketing/**.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj;

/** Scroll the full set of landing blocks in one page (sample copy). */
export const AllBlocks: Story = {
  render: () => (
    <>
      <PromoBanner href="#" linkLabel="Details">
        New marketing blocks — browse individual stories in the sidebar.
      </PromoBanner>
      <Navigation
        logo={mockLogo}
        links={[
          { label: 'Features', href: '#features' },
          { label: 'Pricing', href: '#pricing' },
          { label: 'FAQ', href: '#faq' },
        ]}
        cta={{ label: 'Get started', href: '#cta' }}
      />
      <main className="space-y-2 pt-16">
        <HeroSplit
          title="Build landing pages faster"
          description="Composable blocks with soft-neutral tokens and `ds-mkt-*` depth utilities."
          primaryAction={{ label: 'Start free', href: '#' }}
          secondaryAction={{ label: 'View docs', href: '#' }}
          image={{ src: 'https://placehold.co/640x480', alt: 'Product preview' }}
        />
        <TrustBadges
          title="Trusted by teams who ship"
          items={[{ label: 'SOC 2 ready' }, { label: 'GDPR friendly' }, { label: 'SSO' }]}
        />
        <StatsStrip
          stats={[
            { value: '22+', label: 'Blocks' },
            { value: '<50kb', label: 'CSS utilities' },
            { value: '100%', label: 'Token-aware' },
          ]}
        />
        <Section
          id="features"
          title="Feature highlights"
          description="Alternating media rows inside a section shell."
        >
          <FeatureMedia
            title="Design system first"
            description="Shared primitives keep marketing and app UI aligned."
            image={{ src: 'https://placehold.co/560x360', alt: 'Feature' }}
            imagePosition="left"
          />
        </Section>
        <ProjectLaunches
          eyebrow="Roadmap"
          title="Products"
          liveLabel="Live"
          comingSoonLabel="Soon"
          projects={[
            {
              name: 'Core kit',
              description: 'UI + marketing blocks in one package.',
              href: '#',
              status: 'live',
            },
            {
              name: 'CLI scaffolder',
              description: 'Spin up sites from templates.',
              href: '#',
              status: 'coming-soon',
            },
          ]}
        />
        <PricingSection
          id="pricing"
          title="Simple pricing"
          description="Three tiers with optional comparison table."
          tiers={[
            {
              name: 'Starter',
              price: '$0',
              period: '/mo',
              description: 'For experiments.',
              features: ['All blocks', 'Storybook'],
              cta: { label: 'Start', href: '#' },
            },
            {
              name: 'Team',
              price: '$29',
              period: '/mo',
              description: 'For production sites.',
              features: ['Priority support', 'Custom tokens'],
              cta: { label: 'Upgrade', href: '#' },
              highlighted: true,
            },
            {
              name: 'Enterprise',
              price: 'Custom',
              description: 'Security reviews & SLA.',
              features: ['SSO', 'Dedicated support'],
              cta: { label: 'Contact', href: '#' },
            },
          ]}
        />
        <VideoShowcase
          title="Walkthrough"
          description="Embed or native video."
          embedUrl="https://www.youtube.com/embed/ScMzIvxBSi4"
        />
        <Testimonial
          quote="We shipped our marketing site in a weekend."
          attribution="Alex Kim"
          role="Founder"
        />
        <LogoCloud
          title="Teams we admire"
          logos={[
            { src: 'https://placehold.co/120x40', alt: 'Logo A' },
            { src: 'https://placehold.co/120x40', alt: 'Logo B' },
          ]}
        />
        <BentoFeatures
          title="Bento grid"
          cells={[
            { title: 'Fast', description: 'Static-first friendly.' },
            { title: 'Accessible', description: 'Focus rings by default.' },
          ]}
        />
        <BlogTeaser
          title="From the blog"
          posts={[
            {
              title: 'Token overrides',
              excerpt: 'Theme without forking components.',
              date: 'Jul 2026',
              href: '#',
            },
          ]}
        />
        <TeamGrid
          title="Team"
          members={[
            { name: 'Sam', role: 'Design', image: { src: 'https://placehold.co/80', alt: '' } },
          ]}
        />
        <FaqSection
          id="faq"
          title="FAQ"
          items={[
            { question: 'Can I override tokens?', answer: 'Yes — set CSS variables on :root.' },
          ]}
        />
        <Section title="Why us" variant="soft">
          <div className="grid gap-5 md:grid-cols-2">
            <ServiceCard
              title="Performance"
              description="Lean bundles out of the box."
              icon={<Zap className="size-5" />}
            />
            <ServiceCard
              title="Security"
              description="Patterns that scale to enterprise."
              icon={<Shield className="size-5" />}
            />
          </div>
        </Section>
        <Newsletter
          title="Stay in the loop"
          description="Occasional product notes — no spam."
          placeholder="you@company.com"
          buttonLabel="Subscribe"
        />
        <ContactSection
          title="Contact"
          email="hello@example.com"
          description="We reply within two business days."
        >
          <p className="text-sm text-muted-foreground">Drop a form or embed here.</p>
        </ContactSection>
        <CtaBanner
          id="cta"
          variant="gradient"
          title="Ready to ship?"
          description="Compose a page from these blocks in minutes."
          primaryAction={{ label: 'Browse stories', href: '#' }}
        />
      </main>
      <Footer logo="YCA Software" description="Shared marketing kit for YCA apps." />
    </>
  ),
};
