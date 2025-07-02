import mongoose from "mongoose"
import "dotenv/config"

export  const connectDB = async() => {
    try {
       const connected = await mongoose.connect(process.env.MONGO_URI);
       console.log(`MongoDB connected ${connected.connection.host}`)
    } catch (error) {
        console.log("mongoDB Error : " + error);
        process.exit(1);
    }
};