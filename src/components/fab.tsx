import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils';

const fabVariants = cva(
  // Material 3 FAB without M3's shadow, borders not shadows. The two light
  // variants carry an outline-variant border instead, so they still stand
  // off the page.
  'state-layer inline-flex items-center justify-center overflow-hidden transition-all duration-200 ease-out cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-offset-2 label-large disabled:pointer-events-none disabled:bg-on-surface/12 disabled:text-on-surface/38',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground',
        tonal: 'bg-primary-container text-primary-container-foreground border border-outline-variant',
        secondary: 'bg-secondary text-secondary-foreground',
        tertiary: 'bg-tertiary text-tertiary-foreground',
        surface: 'bg-surface-container-low text-primary border border-outline-variant',
      },
    },
    defaultVariants: { variant: 'primary' },
  },
);

// M3 corner per size, small 12dp, standard 16dp, large 28dp, the same for
// the extended form.
const SIZE = {
  small: { circle: 'w-10 h-10', extended: 'h-10 px-4 gap-2', shape: 'rounded-[var(--radius-card)]' },
  standard: { circle: 'w-14 h-14', extended: 'h-14 px-5 gap-3', shape: 'rounded-[var(--radius-fab)]' },
  large: { circle: 'w-24 h-24', extended: 'h-24 px-7 gap-4', shape: 'rounded-[var(--radius-dialog)]' },
} as const;

type FabSize = keyof typeof SIZE;

interface FabBaseProps extends VariantProps<typeof fabVariants> {
  size?: FabSize;
  extended?: boolean;
  icon: React.ReactNode;
  label?: string;
  href?: string;
  className?: string;
}

type FabProps = FabBaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement> & React.ButtonHTMLAttributes<HTMLButtonElement>, 'className'>;

export function Fab({
  variant,
  size = 'standard',
  extended = false,
  icon,
  label,
  href,
  className,
  ...props
}: FabProps) {
  const shape = `${extended ? SIZE[size].extended : SIZE[size].circle} ${SIZE[size].shape}`;
  const classes = cn(fabVariants({ variant }), shape, className);
  const content = (
    <>
      <span className="shrink-0 flex items-center justify-center">{icon}</span>
      {extended && label && <span className="whitespace-nowrap">{label}</span>}
    </>
  );

  if (href) {
    return (
      <a href={href} className={classes} {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {content}
      </a>
    );
  }
  return (
    <button className={classes} {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {content}
    </button>
  );
}