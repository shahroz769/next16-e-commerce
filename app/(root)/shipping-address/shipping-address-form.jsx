'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
// import { shippingAddressDefaultValues } from '@/lib/constants';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader } from 'lucide-react';

// Schema for the shipping address
const shippingAddressSchema = z.object({
    fullName: z.string().min(3, 'Name must be at least 3 characters'),
    streetAddress: z.string().min(3, 'Address must be at least 3 characters'),
    city: z.string().min(3, 'City must be at least 3 characters'),
    state: z.string().min(3, 'State must be at least 3 characters'),
});

const ShippingAddressForm = ({ address }) => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const form = useForm({
        resolver: zodResolver(shippingAddressSchema),
        defaultValues: address || {
            fullName: '',
            streetAddress: '',
            city: '',
            state: '',
        },
    });

    const onSubmit = (values) => {
        console.log('Shipping Address:', values);
        return;
    };

    return (
        <div className='max-w-md mx-auto space-y-4'>
            <h1 className='mt-4 h2-bold'>Shipping Address</h1>
            <p className='text-sm text-muted-foreground'>
                Please enter your shipping details below.
            </p>
            <Form {...form}>
                <form
                    method='post'
                    className='space-y-4'
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <div className='flex flex-col gap-5 md:flex-row'>
                        <FormField
                            control={form.control}
                            name='fullName'
                            render={({ field, fieldState }) => (
                                <FormItem className='w-full'>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='Enter full name'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className='flex flex-col gap-5 md:flex-row'>
                        <FormField
                            control={form.control}
                            name='streetAddress'
                            render={({ field, fieldState }) => (
                                <FormItem className='w-full'>
                                    <FormLabel>Street Address</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='Enter street address'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className='flex flex-col gap-5 md:flex-row'>
                        <FormField
                            control={form.control}
                            name='city'
                            render={({ field, fieldState }) => (
                                <FormItem className='w-full'>
                                    <FormLabel>City</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='Enter city name'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className='flex flex-col gap-5 md:flex-row'>
                        <FormField
                            control={form.control}
                            name='state'
                            render={({ field, fieldState }) => (
                                <FormItem className='w-full'>
                                    <FormLabel>State</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='Enter state name'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className='flex gap-2'>
                        <Button type='submit' disabled={isPending}>
                            {isPending ? (
                                <Loader className='w-4 h-4 animate-spin' />
                            ) : (
                                <ArrowRight className='w-4 h-4' />
                            )}{' '}
                            Continue
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default ShippingAddressForm;
