'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { addItemToCart } from '@/lib/actions/cart.actions';

const AddToCart = ({ item }) => {
    const router = useRouter();

    const handleAddToCart = async () => {
        const res = await addItemToCart(item);

        if (!res.success) {
            toast.error(res.message || 'Failed to add item to cart', {
                closeButton: true,
            });
            return;
        }

        toast.success(`${item.name} added to cart`, {
            closeButton: true,
            action: {
                label: 'Go to Cart',
                onClick: () => router.push('/cart'),
            },
        });
    };

    return (
        <Button className='w-full' type='button' onClick={handleAddToCart}>
            <Plus />
            Add to Cart
        </Button>
    );
};

export default AddToCart;
