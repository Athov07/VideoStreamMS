import dotenv from 'dotenv';
dotenv.config();
import connectDB from "./config/db.js";
import { app } from "./app.js";
import { logger } from "./utils/logger.js";

const PORT = process.env.PORT || 6500;

// Connect to MongoDB then start server
connectDB()
    .then(() => {
        app.on("error", (error) => {
            logger.error(`Express Server Error: ${error}`);
            throw error;
        });

        app.listen(PORT, () => {
            logger.info(`Interaction Service is running on port: ${PORT}`);
        });
    })
    .catch((err) => {
        logger.error(`MongoDB connection failed: ${err.message}`);
        process.exit(1);
    });

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
    logger.error(`Unhandled Rejection: ${err.message}`);
    // Close server & exit process
    process.exit(1);
});