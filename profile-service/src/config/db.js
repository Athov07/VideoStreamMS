import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_Name,
    });
    console.log(` MongoDB Connected: ${conn.connection.host}`);
    console.log("Connected DB:", mongoose.connection.name);
  } catch (error) {
    console.error("DB Connection Error:", error);
    process.exit(1);
  }
};
