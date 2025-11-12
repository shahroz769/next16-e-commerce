import { getUserCart } from '@/lib/actions/cart.actions';
import { auth, getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ShippingAddressForm from './shipping-address-form';

export const metadata = {
    title: 'Shipping Address',
    description: 'Enter your shipping address details',
};

const ShippingAddressPage = async () => {
    const cart = await getUserCart();
    if (!cart || cart.items.length === 0) {
        redirect('/cart');
    }

    const user = await getCurrentUser();
    if (!user) {
        throw new Error('No User Found');
    }

    return (
        <>
            <ShippingAddressForm address={user.address} />
        </>
    );
};

export default ShippingAddressPage;
