import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db.js';
import app from './app.js';


const PORT = process.env.PORT || 5500;

// Connect to Database first
connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(` Video Service is running at http://localhost:${PORT}`);
        });
        
        app.on("error", (error) => {
            console.error("Express Server Error: ", error);
            throw error;
        });
    })
    .catch((err) => {
        console.log("MongoDB connection failed !!! ", err);
    });