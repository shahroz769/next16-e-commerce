// import mongoose from 'mongoose';

// let connectionPromise = null;

// const connectDB = async () => {
//     if (connectionPromise) {
//         return connectionPromise;
//     }

//     if (mongoose.connection.readyState === 1) {
//         return Promise.resolve();
//     }

//     connectionPromise = (async () => {
//         try {
//             await mongoose.connect(process.env.MONGODB_URI, {
//                 bufferCommands: false,
//             });

//             mongoose.set('strictQuery', true);
//             console.log('MongoDB connected successfully');
//         } catch (error) {
//             console.error('Database connection error:', error);
//             connectionPromise = null;
//             throw new Error('Failed to connect to database');
//         }
//     })();

//     await connectionPromise;
//     connectionPromise = null;
// };

// export default connectDB;

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose
            .connect(MONGODB_URI, opts)
            .then((mongoose) => {
                return mongoose;
            });
    }
    cached.conn = await cached.promise;
    return cached.conn;
}

export default dbConnect;
