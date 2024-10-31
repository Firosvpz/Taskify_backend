import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI as string;
    await mongoose.connect(mongoURI);
  } catch (error) {
    console.error("Error occurred while connecting MongoDB", error);
    process.exit(1);
  }
};

export default connectDB;
