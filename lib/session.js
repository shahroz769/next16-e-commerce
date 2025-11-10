import 'server-only';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secretKey = process.env.JWT_SECRET;
const key = new TextEncoder().encode(secretKey);

// Encrypt payload into JWT
export async function encrypt(payload) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('1w')
        .sign(key);
}

// Decrypt a JWT and return the payload
export async function decrypt(input) {
    try {
        const { payload } = await jwtVerify(input, key, {
            algorithms: ['HS256'],
        });
        return payload;
    } catch (error) {
        console.error('JWT verification failed:', error);
        return null;
    }
}

// Create the session cookie
export async function createSession(userId) {
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const session = await encrypt({ userId, expires });

    (await cookies()).set('session', session, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expires: expires,
        path: '/',
    });
}

// Delete the session cookie
export async function deleteSession() {
    (await cookies()).delete('session');
}

// Get the current session from the cookie
export async function getSession() {
    const sessionCookie = (await cookies()).get('session')?.value;
    if (!sessionCookie) {
        return null;
    }
    return await decrypt(sessionCookie);
}
