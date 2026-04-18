import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db.js';
import app from './app.js';
import { connectKafka, connectWithRetry } from './services/kafka.service.js';

const PORT = process.env.PORT || 5500;

const startServer = async () => {
    try {
        // 1. Connect to MongoDB
        await connectDB();
        console.log("Video Service: Database Connected");

        // 2. Connect to Kafka with Retry
        // This handles the Producer, Consumer, and Subscription setup
        await connectWithRetry(connectKafka);

        // 3. Start Express Server
        app.listen(PORT,() => {
            console.log(`Video Service running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Video Service: Failed to start:", error.message);
        process.exit(1);
    }
};

startServer();