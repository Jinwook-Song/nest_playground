'use client';

import Link from 'next/link';
import SignupForm from '@/components/auth/signup-form';
import { SignupFormData } from '@/lib/auth/schema';
import { authClient } from '@/lib/auth/client';
import { useRouter } from 'next/navigation';
import { UseFormSetError } from 'react-hook-form';

export default function SignupPage() {
  const router = useRouter();

  const handleSubmit = async (
    { name, email, password }: SignupFormData,
    setError: UseFormSetError<SignupFormData>,
  ) => {
    const { error } = await authClient.signUp.email({
      name,
      email,
      password,
    });

    if (error) {
      console.error(error);
      setError('root', { message: error.message });
      return;
    }

    await authClient.signIn.email({
      email,
      password,
    });

    router.push('/');
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div className='text-center'>
          <h2 className='mt-6 text-3xl font-extrabold text-foreground'>
            Create an account
          </h2>
          <p className='mt-2 text-sm text-muted-foreground'>
            Already have an account?{' '}
            <Link
              href='/login'
              className='font-medium text-primary hover:text-primary/80'
            >
              Login
            </Link>
          </p>
        </div>
        <SignupForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
