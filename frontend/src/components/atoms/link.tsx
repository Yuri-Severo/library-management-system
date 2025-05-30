import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

const linkVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 transition-all duration-150',
  {
    variants: {
      variant: {
        default:
          'text-quinary-400 hover:text-quinary-500 active:text-quinary-600 focus-visible:outline-quinary-400 text-base/[24px] font-medium ring-0 outline-0 hover:underline hover:underline-offset-2 focus-visible:outline-2',
        asChild: '',
      },
      size: {
        default: 'px-2 py-1 rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof linkVariants> {
  asChild?: boolean;
}

function Link({ asChild, className, variant, size, ...props }: LinkProps) {
  const Comp = asChild ? Slot : 'a';

  return (
    <Comp
      className={cn(linkVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Link, linkVariants };
