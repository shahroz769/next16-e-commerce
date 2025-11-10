'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Plus, Minus, Loader } from 'lucide-react';
import { toast } from 'sonner';
import { addItemToCart, removeItemFromCart } from '@/lib/actions/cart.actions';
import { useTransition } from 'react';

const AddToCart = ({ cart, item }) => {
    const router = useRouter();

    const [isPending, startTransition] = useTransition();

    // Handle add to cart
    const handleAddToCart = async () => {
        startTransition(async () => {
            const res = await addItemToCart(item);

            if (!res.success) {
                toast.error(res.message || 'Failed to add item to cart', {
                    closeButton: true,
                });
                return;
            }

            toast.success(res.message, {
                closeButton: true,
                action: {
                    label: 'Go to Cart',
                    onClick: () => router.push('/cart'),
                },
            });
        });
    };

    // Handle remove from cart
    const handleRemoveFromCart = async () => {
        startTransition(async () => {
            const res = await removeItemFromCart(item.productId);
            if (!res.success) {
                toast.error(res.message || 'Failed to remove item from cart', {
                    closeButton: true,
                });
                return;
            }

            toast.success(res.message, {
                closeButton: true,
                action: {
                    label: 'Go to Cart',
                    onClick: () => router.push('/cart'),
                },
            });
        });
    };

    //Check if item is already in cart
    const existingItem = cart?.items.find(
        (cartItem) => cartItem.productId === item.productId
    );
    return existingItem ? (
        <div>
            <Button
                type='button'
                variant='outline'
                onClick={handleRemoveFromCart}
                disabled={isPending}
            >
                {isPending ? (
                    <Loader className='w-4 h-4 animate-spin' />
                ) : (
                    <Minus className='w-4 h-4' />
                )}
            </Button>
            <span className='px-2'>{existingItem.qty}</span>
            <Button
                type='button'
                variant='outline'
                onClick={handleAddToCart}
                disabled={isPending}
            >
                {isPending ? (
                    <Loader className='w-4 h-4 animate-spin' />
                ) : (
                    <Plus className='w-4 h-4' />
                )}
            </Button>
        </div>
    ) : (
        <Button
            className='w-full'
            type='button'
            onClick={handleAddToCart}
            disabled={isPending}
        >
            {isPending ? (
                <Loader className='w-4 h-4 animate-spin' />
            ) : (
                <Plus className='w-4 h-4' />
            )}
            Add to Cart
        </Button>
    );
};

export default AddToCart;
