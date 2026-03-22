import dotenv from "dotenv";
dotenv.config();
import express from 'express';
import cors from 'cors';
import profileRoutes from './routes/profile.routes.js';
import subscriptionRoutes from './routes/subscription.routes.js';
import { errorHandler } from './middlewares/error.middleware.js';

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

// Routes
// app.use('/api/profile', profileRoutes);
app.use('/', profileRoutes);
app.use('/api/subscriptions', subscriptionRoutes);

// Global Error Handler (Must be last)
app.use(errorHandler);

export default app;