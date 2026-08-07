import mongoose from "mongoose";

let cached = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
    global.mongoose = cached;
}

export default async function connectDB() {
    if (!process.env.MONGODB_URI) {
        throw new Error("MONGODB_URI environment variable is missing");
    }

    if (cached.conn && mongoose.connection.readyState === 1) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(process.env.MONGODB_URI, opts).then((mongooseInstance) => {
            return mongooseInstance;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (error) {
        cached.promise = null;
        console.error("Error connecting to MongoDB Atlas:", error);
        throw error;
    }

    return cached.conn;
}