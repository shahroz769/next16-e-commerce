import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

// Convert MongoDB Object into a regular JS object
export function convertToPlainObject(mongoObj) {
    return JSON.parse(JSON.stringify(mongoObj));
}

// Format price with thousands separator
export function formatPrice(price) {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return numPrice.toLocaleString('en-PK', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });
}
