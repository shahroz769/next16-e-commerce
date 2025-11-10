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
import SignUpForm from './sign-up-form';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata = {
    title: 'Sign Up',
    description:
        'Create a new account to access exclusive features and manage your orders.',
};

const SignUpPage = async ({ searchParams }) => {
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
                    <CardTitle className='text-center'>
                        Create Account
                    </CardTitle>
                    <CardDescription className='text-center'>
                        Create a new account to get started
                    </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                    {/* Sign-up form */}
                    <SignUpForm />
                </CardContent>
            </Card>
        </div>
    );
};

export default SignUpPage;
