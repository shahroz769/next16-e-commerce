import mongoose from 'mongoose';

let connectionPromise = null;

const connectDB = async () => {
    if (connectionPromise) {
        return connectionPromise;
    }

    if (mongoose.connection.readyState === 1) {
        return Promise.resolve();
    }

    connectionPromise = (async () => {
        try {
            await mongoose.connect(process.env.MONGODB_URI, {
                bufferCommands: false,
            });

            mongoose.set('strictQuery', true);
            console.log('MongoDB connected successfully');
        } catch (error) {
            console.error('Database connection error:', error);
            connectionPromise = null;
            throw new Error('Failed to connect to database');
        }
    })();

    await connectionPromise;
    connectionPromise = null;
};

export default connectDB;
