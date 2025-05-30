import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <div className='flex min-h-screen w-full flex-col items-center justify-center gap-3'>
      <h1 className='mb-4 text-4xl font-bold'>
        Olá, essa página ainda não está pronta
      </h1>
      <p className='text-muted-foreground italic'>
        visite nossa página de cadastro
      </p>
      <Button asChild size={'lg'} className='mt-4'>
        <Link href='/register'>Ir para Cadastro</Link>
      </Button>
    </div>
  );
}
