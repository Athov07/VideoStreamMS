import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import paymentRoutes from "./routes/payment.routes.js";
import planRoutes from "./routes/plan.routes.js";
import subscriptionRoutes from "./routes/subscription.routes.js";

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: "16kb" }));
app.use(cookieParser());

// Routes
app.use("/payments", paymentRoutes);
app.use("/plans", planRoutes);
app.use("/subscriptions", subscriptionRoutes);

export { app };