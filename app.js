// import express from "express";
// import { dbConnection } from "./database/dbConnection.js";
// import jobRouter from "./routes/jobRoutes.js";
// import userRouter from "./routes/userRoutes.js";
// import applicationRouter from "./routes/applicationRoutes.js";
// import { config } from "dotenv";
// import cors from "cors";
// import { errorMiddleware } from "./middlewares/error.js";
// import cookieParser from "cookie-parser";
// import fileUpload from "express-fileupload";

// const app = express();
// config({ path: "./config/config.env" });

// app.options("*", cors({
//   origin: [process.env.FRONTEND_URL],
//   methods: ["GET", "POST", "DELETE", "PUT"],
//   credentials: true,
// }));


// app.use(cookieParser());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.use(
//   fileUpload({
//     useTempFiles: true,
//     tempFileDir: "/tmp/",
//   })
// );


// app.use("/api/v1/user", userRouter);
// app.use("/api/v1/job", jobRouter);
// app.use("/api/v1/application", applicationRouter);

// dbConnection();

// app.use(errorMiddleware);
// export default app;

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

// CORS configuration - Apply to all routes
app.use(cors({
  origin: [process.env.FRONTEND_URL, "https://job-application-frontend-liard.vercel.app"],
  methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
}));

// Handle preflight requests explicitly
app.options("*", cors({
  origin: [process.env.FRONTEND_URL, "https://job-application-frontend-liard.vercel.app"],
  methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
}));

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

dbConnection();

app.use(errorMiddleware);
export default app;