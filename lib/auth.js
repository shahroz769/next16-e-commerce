import 'server-only';
import { cache } from 'react';
import { redirect } from 'next/navigation';
import { getSession } from './session';
import dbConnect from './dbConnect';
import { User } from '@/models/Models';
import { convertToPlainObject } from './utils';

export const auth = cache(async () => {
    const session = await getSession();
    if (!session?.userId) {
        return null;
    }
    return session;
});

export const getCurrentUser = cache(async () => {
    const session = await getSession();
    if (!session?.userId) {
        return null;
    }

    try {
        await dbConnect();
        const user = await User.findById(session.userId).lean();

        if (!user) {
            return null;
        }

        return convertToPlainObject(user);
    } catch (error) {
        console.error('Failed to fetch user:', error);
        return null;
    }
});

export async function verifyAuth(redirectUrl = '/sign-in') {
    const user = await getCurrentUser();
    if (!user) {
        redirect(redirectUrl);
    }
    return { user };
}
