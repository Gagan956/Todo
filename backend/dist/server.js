import 'dotenv/config';
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { requestLogger } from "./middlewares/loggerMiddleware.js";
import authRoutes from "./routes/auth.js";
import todoRoutes from "./routes/todos.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { verifyEmailConnection } from "./utils/email.js";
const app = express();
const PORT = process.env.PORT || 5000;
// Validate
if (!process.env.MONGODB_URI) {
    console.error(" ERROR: MONGODB_URI is missing in .env file");
    process.exit(1);
}
// Middlewares
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || "https://todo-5vr0vlxpb-gagans-projects-27b6b951.vercel.app",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options(/.*/, cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(requestLogger);
// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
});
app.use('/api/', limiter);
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);
// Health Check
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Server is running",
        timestamp: new Date().toISOString(),
    });
});
// 404 Handler
app.use((_req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});
// Error Handler
app.use(errorHandler);
// Database Connect
mongoose
    .connect(process.env.MONGODB_URI)
    .then(async () => {
    console.log(" MongoDB Connected");
    // Verify email connection on startup
    console.log(" Verifying email connection...");
    const emailConnected = await verifyEmailConnection();
    if (!emailConnected) {
        console.error(" Email service is not configured properly");
    }
    else {
        console.log(" Email service is ready");
    }
    app.listen(PORT, () => {
        console.log(` Server running on port ${PORT}`);
    });
})
    .catch((err) => {
    console.error("Database Error:", err);
    process.exit(1);
});
//# sourceMappingURL=server.js.map