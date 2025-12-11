import express from "express";
import connectdb from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./routes/user.routes.js";
import geminiResponse from "./gemini.js";

dotenv.config();

const app = express();

app.use(cors({
    origin: "https://virtual-assistant-frontend-kt81.onrender.com",
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.listen(process.env.PORT, () => {
    connectdb();
    console.log(`Server running on port ${process.env.PORT}`);
});
