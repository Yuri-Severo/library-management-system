'use client';

import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

const buttonRouterVariants = {
  previous: (className?: string) => (
    <ArrowLeft
      className={cn(
        'h-6 w-6 text-black/60 transition-all group-hover:text-black group-focus-visible:text-black group-active:text-black/80',
        className,
      )}
    />
  ),
  next: (className?: string) => (
    <ArrowRight
      className={cn(
        'h-6 w-6 text-black/60 transition-all group-hover:text-black group-focus-visible:text-black group-active:text-black/80',
        className,
      )}
    />
  ),
};

function ButtonRouter({
  className,
  variant,
  ...props
}: React.ComponentProps<'button'> & {
  variant?: 'previous' | 'next';
}) {
  const router = useRouter();

  const isPrevious = variant === 'previous';
  const isNext = variant === 'next';

  const redirect = () => (isNext ? router.forward() : router.back());

  return (
    <Button
      variant={'comeBack'}
      size={'comeBack'}
      aria-label={
        isPrevious
          ? 'Botão para retornar a página anterior'
          : 'Botão para avançar para a próxima página'
      }
      onClick={redirect}
      {...props}
    >
      {isPrevious
        ? buttonRouterVariants.previous(className)
        : buttonRouterVariants.next(className)}
    </Button>
  );
}

export { ButtonRouter, buttonRouterVariants };
