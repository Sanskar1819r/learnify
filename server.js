import express, { urlencoded } from "express";
import authRoutes from "./routes/auth.route.js"
import userRoutes from "./routes/user.route.js"
import chatRoutes from "./routes/chat.route.js"
import cookieParser from "cookie-parser"
import { connectDB } from "./lib/db.js";
import "dotenv/config";


const app = express();
const PORT = process.env.PORT;
app.use(express.json());
app.use(urlencoded({extended: true}));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes)


app.listen(PORT || 5000, () => {
    connectDB();
    console.log(`server is runnung on port : ${PORT}`);
});