import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorMiddleware from "./middlewares/error.middleware.js";

// Import Routes
import likeRoutes from "./routes/like.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import adminRoutes from "./routes/admin.routes.js";

const app = express();

// Global Middlewares
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// API Routes
// app.use("/api/likes", likeRoutes);
// app.use("/api/comments", commentRoutes);
// app.use("/", likeRoutes);
// app.use("/", commentRoutes);
app.use("/likes", likeRoutes);
app.use("/comments", commentRoutes);
app.use("/admin", adminRoutes);

// Health Check (Optional but recommended for Microservices)
app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK", service: "Interaction-Service" });
});

// Error Middleware (Must be last)
app.use(errorMiddleware);

export { app };