import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db.js';
import app from './app.js';
import { connectKafka } from './services/kafka.service.js';


const PORT = process.env.PORT || 5500;

// Connect to Database first
connectDB()
    .then(async () => {
        await connectKafka(); 
        app.listen(PORT, () => {
            console.log(`Video Service is running at http://localhost:${PORT}`);
        });
    })