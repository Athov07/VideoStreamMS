import dotenv from 'dotenv';
dotenv.config();
import connectDB from "./config/db.js";
import { app } from "./app.js";
import { logger } from "./utils/logger.js";
import { connectProducer, connectWithRetry } from "./services/kafka.service.js"; 

const PORT = process.env.PORT || 6500;

const startServer = async () => {
    try {
        // 1. Connect to MongoDB
        await connectDB();
        logger.info("MongoDB connected successfully");

        // 2. Connect to Kafka Producer with Retry
        // This prevents the process.exit(1) from triggering during Kafka's startup
        await connectWithRetry(connectProducer);
        logger.info("Kafka Producer connected successfully");

        // 3. Start Express
        const server = app.listen(PORT,() => {
            logger.info(`Interaction Service is running on port: ${PORT}`);
        });

        server.on("error", (error) => {
            logger.error(`Express Server Error: ${error}`);
        });

    } catch (err) {
        logger.error(`Startup failed: ${err.message}`);
        process.exit(1);
    }
};

startServer();

// Global error handlers
process.on("unhandledRejection", (err) => {
    logger.error(`Unhandled Rejection: ${err.message}`);
    process.exit(1);
});