import mongoose from "mongoose";
const mongoURI = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    console.log("mongouri", mongoURI);
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
