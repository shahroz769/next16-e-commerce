import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { APP_NAME } from '@/lib/constants';
import Image from 'next/image';
import Link from 'next/link';
import SignInForm from './sign-in-form';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata = {
    title: 'Sign In',
    description:
        'Sign in to your account to access exclusive features and manage your orders.',
};

const SignInPage = async ({ searchParams }) => {
    const { callbackUrl } = await searchParams;
    const user = await getCurrentUser();
    if (user) {
        return redirect(callbackUrl || '/');
    }
    return (
        <div className='w-full max-w-md mx-auto'>
            <Card>
                <CardHeader className='space-y-4'>
                    <Link href='/' className='flex-center'>
                        <Image
                            src='/images/logo.svg'
                            width={100}
                            height={100}
                            alt={`${APP_NAME} Logo`}
                            priority
                        />
                    </Link>
                    <CardTitle className='text-center'>Sign In</CardTitle>
                    <CardDescription className='text-center'>
                        Sign in your account
                    </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                    {/* Sign-in form */}
                    <SignInForm />
                </CardContent>
            </Card>
        </div>
    );
};

export default SignInPage;
