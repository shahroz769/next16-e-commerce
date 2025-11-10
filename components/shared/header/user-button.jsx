import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserIcon } from 'lucide-react';
import { signOut } from '@/lib/actions/auth.actions';
import { getCurrentUser } from '@/lib/auth';

const UserButton = async () => {
    const user = await getCurrentUser();
    if (!user) {
        return (
            <Button asChild>
                <Link href='/sign-in' aria-label='Sign In'>
                    <UserIcon /> Sign In
                </Link>
            </Button>
        );
    }

    const firstInitial = user?.name?.charAt(0).toUpperCase() ?? 'U';
    return (
        <div className='flex items-center gap-2'>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div className='flex items-center'>
                        <Button
                            variant='ghost'
                            className='relative flex items-center justify-center w-8 h-8 ml-2 bg-gray-200 rounded-full'
                        >
                            {firstInitial}
                        </Button>
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-56' align='end' forceMount>
                    <DropdownMenuLabel className='font-normal'>
                        <div className='flex flex-col space-y-1'>
                            <div className='text-sm font-medium leading-none'>
                                {user.name || 'Shahroz Ahmed'}
                            </div>
                            <div className='text-sm leading-none text-muted-foreground'>
                                {user.email || 'shahroz@example.com'}
                            </div>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuItem className='p-0 mb-1'>
                        <form className='w-full' action={signOut}>
                            <Button
                                className='justify-start w-full h-4 px-2 py-4'
                                variant='ghost'
                            >
                                Sign Out
                            </Button>
                        </form>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default UserButton;
