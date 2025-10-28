// Run this once to create your first admin user
// Usage: node scripts/createAdmin.js

import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, "../.env.local") });

const UserSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  passwordHash: String,
  role: String,
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function createAdmin() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI not found in .env.local");
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "family_assets_db",
    });

    console.log("Connected to MongoDB");

    // Change these values
    const adminData = {
      fullName: "Admin User",
      email: "admin@family.com",
      password: "admin123", // CHANGE THIS!
      role: "admin",
    };

    const existingUser = await User.findOne({ email: adminData.email });
    if (existingUser) {
      console.log("Admin user already exists!");
      process.exit(0);
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(adminData.password, saltRounds);

    const user = await User.create({
      fullName: adminData.fullName,
      email: adminData.email,
      passwordHash,
      role: adminData.role,
    });

    console.log("Admin user created successfully!");
    console.log("Email:", adminData.email);
    console.log("Password:", adminData.password);
    console.log("IMPORTANT: Change the password after first login!");

    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
}

createAdmin();
