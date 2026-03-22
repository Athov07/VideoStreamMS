import dotenv from 'dotenv';
dotenv.config();
import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 6000;

connectDB().then(() => {
    app.listen(PORT, () => console.log(`Profile Service running on ${PORT}`));
});