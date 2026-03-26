import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_Name,
    });
    console.log(` MongoDB Connected: ${conn.connection.host}`);
    console.log("Connected DB:", mongoose.connection.name);
  } catch (error) {
    console.error(` MongoDB Connection Error: ${error.message}`);
    process.env.NODE_ENV === "production" ? process.exit(1) : null;
  }
};

// This provides the 'default' export that server.js is looking for
export default connectDB;
