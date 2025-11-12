import CartTable from './cart-table';
import { getUserCart } from '@/lib/actions/cart.actions';

export const metadata = {
    title: 'Cart',
    description: 'Your shopping cart at Saman360',
};

const CartPage = async () => {
    const cart = await getUserCart();

    return (
        <>
            <CartTable cart={cart} />
        </>
    );
};

export default CartPage;
