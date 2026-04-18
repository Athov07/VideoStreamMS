import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import { app } from "./app.js";
import { connectProducer, connectWithRetry } from './services/kafka.service.js';

const PORT = process.env.PORT || 7000;

const startServer = async () => {
  try {
    // 1. Connect to MongoDB
    await connectDB();
    console.log("Database connected");

    // 2. Connect to Kafka Broker with retry logic
    await connectWithRetry(connectProducer);

    // 3. Start Express
    app.listen(PORT, () => {
      console.log(`Payment Service running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start Payment Service:", error.message);
    process.exit(1); 
  }
};

startServer();