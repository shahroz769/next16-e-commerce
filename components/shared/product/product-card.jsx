import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const ProductCard = ({ product }) => {
    return (
        <Card className='w-full max-w-sm'>
            <CardHeader className='items-center p-o'>
                <Link href={`/product/${product.slug}`}>
                    <Image
                        src={product.images[0]}
                        alt={product.name}
                        height={300}
                        width={300}
                        priority
                    />
                </Link>
            </CardHeader>
            <CardContent className='grid gap-4 p-4'>
                <div className='text-xs'>{product.brand}</div>
                <Link href={`/product/${product.slug}`}>
                    <h2 className='text-sm font-medium'>{product.name}</h2>
                </Link>
                <div className='flex-between'>
                    <p>{product.rating} Stars</p>
                    {product.stock > 0 ? (
                        <p className='font-bold'>${product.price}</p>
                    ) : (
                        <p className='text-destructive'>Out of Stock</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default ProductCard;
