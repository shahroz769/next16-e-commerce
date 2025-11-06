'use server';

import connectDB from '@/config/db';
import Product from '@/models/Product';
import { convertToPlainObject } from '@/lib/utils';

// Get latest products (limit=4)
export async function getLatestProducts() {
    try {
        await connectDB();
        const latestProducts = await Product.find({})
            .sort({ createdAt: -1 })
            .limit(4)
            .lean();

        if (!latestProducts || latestProducts.length === 0) {
            return [];
        }

        return convertToPlainObject(latestProducts);
    } catch (error) {
        console.error('Failed to fetch latest products:', error);
        return [];
    }
}

// Get single product by it's slug
export async function getProductBySlug(slug) {
    try {
        await connectDB();
        const product = await Product.findOne({ slug: slug }).lean();

        if (!product) {
            return null;
        }

        return convertToPlainObject(product);
    } catch (error) {
        console.error('Failed to fetch the product', error);
        return null;
    }
}
