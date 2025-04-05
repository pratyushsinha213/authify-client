import mongoose from "mongoose";
import { MONGO_URI } from "../config/env.js";

const connectToDatabase = async () => {
    if (!MONGO_URI) {
        throw new Error("MONGI_URI is not defined in the .env file");
    }

    try {
        const connect = await mongoose.connect(MONGO_URI);    
        console.log(`MongoDB connected: ${connect.connection.host}/${connect.connection.name}`);
    } catch (error) {
        throw new Error(`MongoDB connection error: ${error.message}`);  
    }
}

export default connectToDatabase;