import { Container } from '@/components/atoms/container';
import { Link } from '@/components/atoms/link';
import FormsLogin from '@/components/organisms/form-login';
import { PAGES } from '@/enums/pages.enum';

export default function Login() {
  return (
    <div className='flex min-h-screen w-full items-center justify-center'>
      <Container className='gap-11'>
        <div className='flex w-full flex-col items-center justify-center gap-2'>
          <h1 className='text-4xl font-bold'>Sign in</h1>
          <p className='text-center text-base'>
            Access your account to continue using the application.
          </p>
        </div>
        <FormsLogin />

        <span className='flex w-full items-center justify-center text-sm'>
          Don&apos;t have an account?
          <Link
            href={PAGES.REGISTER}
            className='px-1 text-sm underline underline-offset-2'
          >
            Create an account
          </Link>
        </span>
      </Container>
    </div>
  );
}
