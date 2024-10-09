import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config()
export const connectToDb = async (): Promise<void> => {
    try {
        const db = await mongoose.connect(process.env.MONGO_URL as string);
        console.log("Database Connected Successfully");
        console.log(`Connection State: ${db.connection.readyState}`);
    } catch (error) {
        console.error("Database connection failed", error);
        process.exit(1); 
    }
};
