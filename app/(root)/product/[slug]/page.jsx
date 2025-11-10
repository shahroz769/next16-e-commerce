import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { getProductBySlug } from '@/lib/actions/product.actions';
import { notFound } from 'next/navigation';
import ProductImages from '@/components/shared/product/product-images';
import AddToCart from '@/components/shared/product/add-to-card';

const ProductDetailsPage = async (props) => {
    const { slug } = await props.params;
    const product = await getProductBySlug(slug);
    if (!product) notFound();
    return (
        <>
            <section>
                <div className='grid grid-cols-1 md:grid-cols-5'>
                    {/* Images Column */}
                    <div className='col-span-2'>
                        <ProductImages images={product.images} />
                    </div>
                    {/* Details Column */}
                    <div className='col-span-2 p-5'>
                        <div className='flex flex-col gap-6'>
                            <p>
                                {product.brand} {product.category}
                            </p>
                            <h1 className='h3-bold'>{product.name}</h1>
                            <p>
                                {product.rating} of {product.numReviews} Reviews
                            </p>
                            <div className='flex flex-col justify-center w-24 gap-3 px-5 py-2 text-green-700 bg-green-100 rounded-full jus sm:flex-row sm:items-center'>
                                <p className='text-2xl'>
                                    ${Number(product.price)}
                                </p>
                            </div>
                        </div>
                        <div className='mt-10'>
                            <p className='font-semibold'>Description</p>
                            <p>{product.description}</p>
                        </div>
                    </div>
                    {/* Action Column */}
                    <div>
                        <Card>
                            <CardContent className='p-4'>
                                <div className='flex justify-between mb-2'>
                                    <div>Price</div>
                                    <div>
                                        <p className='text-2xl'>
                                            ${Number(product.price)}
                                        </p>
                                    </div>
                                </div>
                                <div className='flex justify-between mb-2'>
                                    <div>Status</div>
                                    {product.stock > 0 ? (
                                        <Badge variant='outline'>
                                            In Stock
                                        </Badge>
                                    ) : (
                                        <Badge variant='destructive'>
                                            Out of Stock
                                        </Badge>
                                    )}
                                </div>
                                {product.stock > 0 && (
                                    <div className='flex-center'>
                                        <AddToCart
                                            item={{
                                                productId: product._id,
                                                name: product.name,
                                                slug: product.slug,
                                                price: product.price,
                                                qty: 1,
                                                image: product.images[0],
                                            }}
                                        />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
        </>
    );
};

export default ProductDetailsPage;
