import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

export const ConnectDB = async () => {
    const dbURI = process.env.MONGODB_URI;

    if (!dbURI) {
        console.error("MongoDB URI not found in .env file.");
        return;
    }

    await mongoose.connect(dbURI);
    console.log("DB Connected");
}
