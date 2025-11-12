export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Saman360';
export const APP_DESCRIPTION =
    process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
    'A modern e-commerce store built with Next.js';
export const SERVER_URL =
    process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
export const signInDefaultValues = {
    email: 'shahroz.khan769@gmail.com',
    password: '123456',
};
export const shippingAddressDefaultValues = {
    fullName: 'Shahroz Ahmed',
    streetAddress: 'House #A/13, Street #4, Gulshan-e-Iqbal',
    city: 'Karachi',
    state: 'Sindh',
};