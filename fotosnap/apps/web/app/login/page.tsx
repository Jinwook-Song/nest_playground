'use client';

import Link from 'next/link';
import LoginForm from '@/components/auth/login-form';
import { LoginFormData } from '@/lib/auth/schema';
import { authClient } from '@/lib/auth/client';
import { useRouter } from 'next/navigation';
import { UseFormSetError } from 'react-hook-form';

export default function LoginPage() {
  const router = useRouter();

  const handleSubmit = async (
    { email, password }: LoginFormData,
    setError: UseFormSetError<LoginFormData>,
  ) => {
    const { error } = await authClient.signIn.email({
      email,
      password,
    });

    if (error) {
      console.error(error);
      setError('root', {
        message: 'Invalid email or password. Please try again.',
      });
      return;
    }

    router.push('/');
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div className='text-center'>
          <h2 className='mt-6 text-3xl font-extrabold text-foreground'>
            Login to your account
          </h2>
          <p className='mt-2 text-sm text-muted-foreground'>
            Don't have an account?{' '}
            <Link
              href='/signup'
              className='font-medium text-primary hover:text-primary/80'
            >
              Sign up
            </Link>
          </p>
        </div>
        <LoginForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
