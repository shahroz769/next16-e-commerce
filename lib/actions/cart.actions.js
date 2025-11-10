'use server';

import { cookies } from 'next/headers';
import { auth } from '@/lib/auth';
import { Cart, Product } from '@/models/Models';
import { convertToPlainObject } from '../utils';

const calculateCartPrices = (items) => {
    const itemsPrice = items.reduce((acc, item) => {
        return acc + Number(item.price) * item.qty;
    }, 0);
    const shippingPrice = itemsPrice > 100 ? 0 : 10;
    const totalPrice = itemsPrice + shippingPrice;
    return { itemsPrice, shippingPrice, totalPrice };
};

export async function addItemToCart(cartItem) {
    try {
        const sessionCartId =
            (await cookies()).get('sessionCartId')?.value || undefined;
        if (!sessionCartId) {
            throw new Error('No session cart ID found.');
        }

        const session = await auth();
        const userId = session?.userId ? session.userId : undefined;

        const product = await Product.findById(cartItem.productId);
        if (!product) {
            throw new Error('Product not found.');
        }

        const cart = getUserCart();
        if (!cart) {
            // Create new cart
            const newCart = new Cart({
                userId: userId,
                sessionCartId: sessionCartId,
                items: [cartItem],
                ...calculateCartPrices([cartItem]),
            });
            console.log('Creating new cart:', newCart);
        }

        // console.log(sessionCartId, userId, cartItem);

        return {
            success: true,
            message: 'Item added to cart.',
        };
    } catch (error) {
        return {
            success: false,
            message: error.message || 'Failed to add item to cart.',
        };
    }
}

export async function getUserCart() {
    const sessionCartId =
        (await cookies()).get('sessionCartId')?.value || undefined;
    if (!sessionCartId) {
        throw new Error('No session cart ID found.');
    }

    const session = await auth();
    const userId = session?.userId ? session.userId : undefined;

    const cart = await Cart.find(userId ? { userId } : { sessionCartId });

    if (!cart) {
        return undefined;
    }
    return convertToPlainObject({
        ...cart,
        items: cart.items,
        itemsPrice: cart.itemsPrice,
        totalPrice: cart.totalPrice,
        shippingPrice: cart.shippingPrice,
    });
}
