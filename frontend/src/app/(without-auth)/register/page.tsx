'use client';

import { Container } from '@/components/atoms/container';
import { Link } from '@/components/atoms/link';
import FormsRegister from '@/components/organisms/form-register';
import { PAGES } from '@/enums/pages.enum';

export default function Register() {
  return (
    <div className='flex min-h-screen w-full items-center justify-center'>
      <Container>
        <div className='flex flex-col items-center justify-center gap-4'>
          <h1 className='text-4xl font-bold'>Sign up</h1>
          <p className='text-center text-base'>
            Create your account to access all features and manage your
            authentication securely.
          </p>
        </div>
        <div className='max-h-60 w-full overflow-y-auto md:max-h-full'>
          <FormsRegister />
        </div>
        <span className='flex w-full items-center justify-center text-sm'>
          Already have an account?
          <Link
            href={PAGES.LOGIN}
            className='px-1 text-sm underline underline-offset-2'
          >
            Sign in
          </Link>
        </span>
      </Container>
    </div>
  );
}
