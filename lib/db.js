import mongoose from "mongoose";

let cached = global._mongooseConn;

if (!cached) {
  cached = global._mongooseConn = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI not set in .env.local");
    }

    cached.promise = mongoose
      .connect(process.env.MONGODB_URI, {
        dbName: "family_assets_db",
      })
      .then((m) => m);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
