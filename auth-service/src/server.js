import dotenv from "dotenv";
dotenv.config();
import { app } from './app.js';
import connectDB from './config/db.js';
import { connectProducer } from './services/kafka.service.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();
        await connectProducer(); 
        
        app.listen(PORT, () => {
            console.log(`Auth Service running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Startup failed:", error);
    }
};

startServer();