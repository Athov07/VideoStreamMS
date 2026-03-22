import dotenv from "dotenv";
dotenv.config();
import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(
            `${process.env.MONGO_URI}`
        );
        
        console.log(`\n MongoDB Connected! Host: ${connectionInstance.connection.host}`);
        console.log(` Database: ${connectionInstance.connection.name}`);
    } catch (error) {
        console.error(" MongoDB connection FAILED: ", error);
        // Exit process with failure
        process.exit(1);
    }
};

export default connectDB;