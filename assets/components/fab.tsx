import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils';

const fabVariants = cva(
  'inline-flex items-center justify-center overflow-hidden transition-all duration-200 ease-out cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-offset-2 label-large shadow-[0px_3px_5px_-1px_rgba(0,0,0,0.20),0px_6px_10px_0px_rgba(0,0,0,0.14),0px_1px_18px_0px_rgba(0,0,0,0.12)] hover:brightness-95 active:brightness-90 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground',
        tonal: 'bg-primary-container text-primary-container-foreground',
        secondary: 'bg-secondary text-secondary-foreground',
        tertiary: 'bg-tertiary text-tertiary-foreground',
        surface: 'bg-background text-primary',
      },
    },
    defaultVariants: { variant: 'primary' },
  },
);

const SIZE = {
  small: { circle: 'w-10 h-10', extended: 'h-10 px-4 gap-2' },
  standard: { circle: 'w-14 h-14', extended: 'h-14 px-5 gap-3' },
  large: { circle: 'w-24 h-24', extended: 'h-24 px-7 gap-4' },
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
  const shape = extended ? `${SIZE[size].extended} rounded-[16px]` : `${SIZE[size].circle} rounded-full`;
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