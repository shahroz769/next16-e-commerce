'use server';

import { cookies } from 'next/headers';
import { auth } from '@/lib/auth';
import { Cart, Product } from '@/models/Models';
import { convertToPlainObject } from '../utils';
import { revalidatePath } from 'next/cache';

const calculateCartPrices = (items) => {
    // Calculate total price of all items (price * quantity for each item)
    // Convert price from string to number for calculation
    const itemsPrice = items.reduce((acc, item) => {
        return acc + Number(item.price) * item.qty;
    }, 0);

    // Free shipping if items total is over Rs. 3000, otherwise Rs. 250 shipping fee
    const shippingPrice = itemsPrice > 3000 ? 0 : itemsPrice === 0 ? 0 : 250;

    // Calculate final total price
    const totalPrice = itemsPrice + shippingPrice;

    // Return all prices as strings
    return {
        itemsPrice: itemsPrice,
        shippingPrice: shippingPrice,
        totalPrice: totalPrice,
    };
};

export async function addItemToCart(cartItem) {
    try {
        // Get session cart ID from cookies (used to track guest carts)
        const sessionCartId =
            (await cookies()).get('sessionCartId')?.value || undefined;
        if (!sessionCartId) {
            throw new Error('No session cart ID found.');
        }

        // Get current authenticated user session (if logged in)
        const session = await auth();
        const userId = session?.userId ? session.userId : undefined;

        // Verify the product exists and get current stock information
        const product = await Product.findById(cartItem.productId);
        if (!product) {
            throw new Error('Product not found.');
        }

        // Fetch cart document directly from database (not converted to plain object)
        // This allows us to modify and save the Mongoose document
        let cart = await Cart.findOne(userId ? { userId } : { sessionCartId });

        if (!cart) {
            // Cart doesn't exist - create a new cart with the item
            const newCart = new Cart({
                userId: userId,
                sessionCartId: sessionCartId,
                items: [cartItem],
                ...calculateCartPrices([cartItem]),
            });

            await newCart.save();

            // Revalidate the product page to show updated cart state
            revalidatePath(`/product/${product.slug}`);

            return {
                success: true,
                message: `${product.name} added to cart.`,
            };
        } else {
            // Cart exists - check if this product is already in the cart
            // Convert ObjectIds to strings for proper comparison
            const existingItem = cart.items.find(
                (item) =>
                    item.productId.toString() === cartItem.productId.toString()
            );

            if (existingItem) {
                // Item already exists in cart - update quantity
                // Check if we have enough stock for one more item
                if (product.stock < existingItem.qty + 1) {
                    throw new Error('Product is out of stock.');
                }
                // Increment quantity by 1
                existingItem.qty += 1;
            } else {
                // Item not in cart - add it as a new item
                // Check if product is in stock
                if (product.stock < 1) {
                    throw new Error('Product is out of stock.');
                }
                cart.items.push(cartItem);
            }

            // Recalculate all cart prices based on updated items
            const prices = calculateCartPrices(cart.items);
            cart.itemsPrice = prices.itemsPrice;
            cart.totalPrice = prices.totalPrice;
            cart.shippingPrice = prices.shippingPrice;

            // Save the updated cart to database
            await cart.save();

            // Revalidate the product page to show updated cart state
            revalidatePath(`/product/${product.slug}`);

            return {
                success: true,
                message: `${product.name} ${
                    existingItem ? 'quantity updated in' : 'added to'
                } cart.`,
            };
        }
    } catch (error) {
        // Handle any errors that occur during the process
        return {
            success: false,
            message: error.message || 'Failed to add item to cart.',
        };
    }
}

export async function getUserCart() {
    // Get session cart ID from cookies (used to track guest carts)
    const sessionCartId =
        (await cookies()).get('sessionCartId')?.value || undefined;
    if (!sessionCartId) {
        throw new Error('No session cart ID found.');
    }

    // Get current authenticated user session (if logged in)
    const session = await auth();
    const userId = session?.userId ? session.userId : undefined;

    // Find cart by userId (if logged in) or sessionCartId (if guest)
    const cart = await Cart.findOne(userId ? { userId } : { sessionCartId });

    // Return undefined if no cart exists
    if (!cart) {
        return undefined;
    }

    // Convert MongoDB document to plain JavaScript object
    // This is necessary for Next.js server components to serialize the data
    // Note: Price fields (itemsPrice, totalPrice, shippingPrice) are strings in the database
    // return convertToPlainObject({
    //     ...cart,
    //     items: cart.items,
    //     itemsPrice: cart.itemsPrice,
    //     totalPrice: cart.totalPrice,
    //     shippingPrice: cart.shippingPrice,
    // });
    return convertToPlainObject(cart);
}

export async function removeItemFromCart(productId) {
    try {
        // Get session cart ID from cookies (used to track guest carts)
        const sessionCartId =
            (await cookies()).get('sessionCartId')?.value || undefined;
        if (!sessionCartId) {
            throw new Error('No session cart ID found.');
        }
        // Get Product
        const product = await Product.findById(productId);
        if (!product) {
            throw new Error('Product not found.');
        }

        // Get user's cart
        const cart = await getUserCart();
        if (!cart) {
            throw new Error('Cart not found.');
        }
        // Check if cart contains the item
        const existingItem = cart.items.find(
            (item) => item.productId.toString() === productId.toString()
        );
        if (!existingItem) {
            throw new Error('Item not found in cart.');
        }

        //Check the quantity
        if (existingItem.qty === 1) {
            // Remove item from cart
            cart.items = cart.items.filter(
                (item) => item.productId.toString() !== productId.toString()
            );
        } else {
            // Decrease quantity by 1
            cart.items.find(
                (item) => item.productId.toString() === productId.toString()
            ).qty -= 1;
        }

        // Update cart
        await Cart.findByIdAndUpdate(cart._id, {
            items: cart.items,
            ...calculateCartPrices(cart.items),
        });

        revalidatePath(`/product/${product.slug}`);

        return {
            success: true,
            message: `${product.name} removed from cart.`,
        };
    } catch (error) {
        return {
            success: false,
            message: error.message || 'Failed to remove item from cart.',
        };
    }
}
