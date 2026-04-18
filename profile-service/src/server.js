import dotenv from 'dotenv';
dotenv.config();
import app from './app.js';
import { connectDB } from './config/db.js';
import { connectProducer, connectWithRetry } from './services/kafka.service.js';

const PORT = process.env.PORT || 6000;

const startServer = async () => {
  try {
    // 1. Connect to MongoDB
    await connectDB();
    console.log("Profile Service: Database connected");

    // 2. Connect to Kafka with Retry logic
    await connectWithRetry(connectProducer);

    // 3. Start Express Server
    app.listen(PORT, () => {
      console.log(`Profile Service running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Profile Service: Failed to start:", error.message);
    process.exit(1);
  }
};

startServer();