import mongoose from "mongoose";

let cached = global._mongooseConn;

if (!cached) {
  cached = global._mongooseConn = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    console.log("✅ Using cached database connection");
    return cached.conn;
  }

  if (!process.env.MONGODB_URI) {
    const error = "❌ MONGODB_URI is not defined in environment variables";
    console.error(error);
    throw new Error(error);
  }

  console.log("📡 MongoDB URI exists:", process.env.MONGODB_URI.substring(0, 30) + "...");

  if (!cached.promise) {
    console.log("🔄 Creating new database connection...");
    
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose
      .connect(process.env.MONGODB_URI, opts)
      .then((mongoose) => {
        console.log("✅ MongoDB connected successfully to:", mongoose.connection.name);
        return mongoose;
      })
      .catch((error) => {
        console.error("❌ MongoDB connection error:", error.message);
        console.error("Full error:", error);
        cached.promise = null;
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error("❌ Failed to establish connection:", e);
    throw e;
  }

  return cached.conn;
}
