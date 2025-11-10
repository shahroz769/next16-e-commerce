import { NextResponse } from 'next/server';

export async function proxy(request) {
    console.log(request.url);
    const sessionCartId = request.cookies.get('sessionCartId')?.value;
    if (sessionCartId) {
        return NextResponse.next();
    }
    const newSessionCartId = crypto.randomUUID();
    const response = NextResponse.next();
    response.cookies.set('sessionCartId', newSessionCartId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
    });
    return response;
}

export const config = {
    matcher: ['/', '/product/:path*', '/cart', '/sign-in', '/sign-up'],
};
