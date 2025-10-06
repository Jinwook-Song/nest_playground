import Link from 'next/link';
import SignupForm from '@/components/auth/signup-form';

export default function SignupPage() {
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
        <SignupForm />
      </div>
    </div>
  );
}
