import { cn } from '../../../lib/utils';

export interface LaunchProject {
  name: string;
  description: string;
  href: string;
  status: 'live' | 'coming-soon';
}

export interface ProjectLaunchesProps {
  id?: string;
  eyebrow: string;
  title: string;
  liveLabel: string;
  comingSoonLabel: string;
  projects: LaunchProject[];
  className?: string;
}

/**
 * Product / project launch grid with live vs coming-soon status chips.
 */
export function ProjectLaunches({
  id = 'projects',
  eyebrow,
  title,
  liveLabel,
  comingSoonLabel,
  projects,
  className,
}: ProjectLaunchesProps) {
  return (
    <section id={id} className={cn('px-4 py-20 sm:py-24', className)}>
      <div className="container mx-auto max-w-6xl">
        <div className="mb-10 text-center sm:mb-12">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">{eyebrow}</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {projects.map((project) => (
            <a
              key={project.name}
              href={project.href}
              className="ds-mkt-surface-elevated group flex flex-col rounded-2xl border-0 p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div
                className={cn(
                  'mb-4 inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide',
                  project.status === 'live'
                    ? 'bg-primary/12 text-primary'
                    : 'bg-muted text-muted-foreground',
                )}
              >
                {project.status === 'live' ? liveLabel : comingSoonLabel}
              </div>
              <h3 className="text-lg font-semibold text-foreground group-hover:text-primary">
                {project.name}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {project.description}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
