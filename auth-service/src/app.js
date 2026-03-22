import dotenv from "dotenv";
dotenv.config();
import express from 'express';
import cors from 'cors';
import passport from './config/passport.js';
import authRoutes from './routes/auth.routes.js';
import errorMiddleware from './middlewares/error.middleware.js';

const app = express();

// Configure CORS
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // Allow your Vite app
    credentials: true, // Allow cookies to be sent
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(passport.initialize());

// Routes
// app.use('/api/auth', authRoutes);
app.use('/', authRoutes);

// Error Handler
app.use(errorMiddleware);

export { app }; // Named export for ESM