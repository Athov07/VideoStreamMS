import dotenv from 'dotenv';
dotenv.config();
import app from './app.js';
import { connectDB } from './config/db.js';
import { connectProducer } from './services/kafka.service.js';

const PORT = process.env.PORT || 6000;

const startServer = async () => {
    await connectDB();
    await connectProducer(); 
    app.listen(PORT, () => console.log(`Profile Service running on ${PORT}`));
};

startServer();