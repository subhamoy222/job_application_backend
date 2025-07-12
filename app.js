import express from "express";
import { dbConnection } from "./database/dbConnection.js";
import jobRouter from "./routes/jobRoutes.js";
import userRouter from "./routes/userRoutes.js";
import applicationRouter from "./routes/applicationRoutes.js";
import { config } from "dotenv";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";

const app = express();
config({ path: "./config/config.env" });

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.headers.origin}`);
  next();
});

// CORS configuration - Apply to all routes
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      process.env.FRONTEND_URL, 
      "https://job-application-frontend-liard.vercel.app",
      process.env.LOCALHOST_URL,
      "http://localhost:5173",
      "http://localhost:3000"
    ].filter(Boolean); // Remove undefined values
    
    console.log('CORS check - Origin:', origin);
    console.log('CORS check - Allowed origins:', allowedOrigins);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      console.log('CORS allowed for origin:', origin);
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Cookie"],
  exposedHeaders: ["Set-Cookie"],
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options("*", cors(corsOptions));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use("/api/v1/user", userRouter);
app.use("/api/v1/job", jobRouter);
app.use("/api/v1/application", applicationRouter);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
    routes: {
      user: "/api/v1/user",
      job: "/api/v1/job", 
      application: "/api/v1/application"
    },
    cors: {
      allowedOrigins: [
        process.env.FRONTEND_URL, 
        "https://job-application-frontend-liard.vercel.app",
        process.env.LOCALHOST_URL,
        "http://localhost:5173",
        "http://localhost:3000"
      ].filter(Boolean)
    }
  });
});

// Test CORS endpoint
app.get("/test-cors", (req, res) => {
  res.status(200).json({
    success: true,
    message: "CORS test successful",
    origin: req.headers.origin,
    timestamp: new Date().toISOString()
  });
});

dbConnection();

app.use(errorMiddleware);
export default app;