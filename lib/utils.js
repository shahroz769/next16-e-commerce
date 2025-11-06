import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

// Convert MongoDB Object into a regular JS object
export function convertToPlainObject(mongoObj) {
    return JSON.parse(JSON.stringify(mongoObj));
}