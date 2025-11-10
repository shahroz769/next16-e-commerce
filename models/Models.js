import { Schema, model, models } from 'mongoose';
import bcrypt from 'bcrypt';

// --------------------- USER ---------------------
const userSchema = new Schema(
    {
        name: {
            type: String,
            default: 'NO_NAME',
        },
        email: {
            type: String,
            required: [true, 'Please provide an email'],
            unique: true,
            match: [/.+\@.+\..+/, 'Please provide a valid email'],
        },
        emailVerified: {
            type: Date,
        },
        image: {
            type: String,
        },
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            minlength: 6,
            select: false,
        },
        role: {
            type: String,
            default: 'user',
        },
        address: {
            type: Schema.Types.Mixed,
        },
        paymentMethod: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || !this.password) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare user submitted password with hashed password
userSchema.methods.comparePassword = async function (inputPassword) {
    if (!this.password) {
        return false;
    }
    return await bcrypt.compare(inputPassword, this.password);
};

const User = models.User || model('User', userSchema);

// --------------------- PRODUCT ---------------------
const productSchema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        category: { type: String, required: true, trim: true },
        description: { type: String, required: true, trim: true },
        images: [{ type: String, required: true }],
        price: { type: Schema.Types.Decimal128, required: true, min: 0 },
        brand: { type: String, required: true, trim: true },
        rating: { type: Number, default: 0, min: 0, max: 5 },
        numReviews: { type: Number, default: 0, min: 0 },
        stock: { type: Number, required: true, min: 0 },
        isFeatured: { type: Boolean, default: false },
        banner: { type: String, default: null },
    },
    { timestamps: true }
);

const Product = models.Product || model('Product', productSchema);

// --------------------- CART ITEM (Sub-document) ---------------------
// This schema defines the shape of objects inside the Cart.items array
const cartItemSchema = new Schema(
    {
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            required: true,
        },
        price: {
            type: Schema.Types.Decimal128,
            required: true,
            min: 0,
        },
        qty: {
            type: Number,
            required: true,
            min: [1, 'Quantity cannot be less than 1.'],
            default: 1,
        },
        image: {
            type: String,
            required: true,
        },
    },
    {
        _id: false, // No need for a separate _id for each cart item
    }
);

// --------------------- CART ---------------------
const cartSchema = new Schema(
    {
        // Link to the user. This is optional ('?' in Prisma) to allow for guest carts.
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: false, // Set to false to allow guest carts
        },
        // This is used to track carts for users who are not logged in.
        sessionCartId: {
            type: String,
            required: true,
            unique: true,
        },
        // Array of cart items, using the sub-document schema defined above
        items: [cartItemSchema],

        // --- Price fields ---
        // Use Decimal128 for financial data to avoid floating-point errors
        itemsPrice: {
            type: Schema.Types.Decimal128,
            required: true,
            default: 0,
        },
        totalPrice: {
            type: Schema.Types.Decimal128,
            required: true,
            default: 0,
        },
        shippingPrice: {
            type: Schema.Types.Decimal128,
            required: true,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const Cart = models.Cart || model('Cart', cartSchema);

// --- EXPORT ALL MODELS ---
export { Product, User, Cart };
