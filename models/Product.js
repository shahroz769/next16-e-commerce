import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        category: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        images: [
            {
                type: String,
                required: true,
            },
        ],
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        brand: {
            type: String,
            required: true,
            trim: true,
        },
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        numReviews: {
            type: Number,
            default: 0,
            min: 0,
        },
        stock: {
            type: Number,
            required: true,
            min: 0,
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
        banner: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const Product =
    mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;
