import mongoose from "mongoose";

const connectDb = async () => {
  try {
    console.log("Attempting to connect to MongoDB...");

    // Show which URI is being used (for debugging)
    console.log("MongoDB URL:", process.env.MONGODB_URL);

    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ DB Connection Error:", error.message);
    process.exit(1); // stop server if DB connection fails
  }
};

export default connectDb;
