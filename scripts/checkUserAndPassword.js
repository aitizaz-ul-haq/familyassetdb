import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, "..", ".env.local") });

async function checkUser() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    console.log("URI:", process.env.MONGODB_URI?.substring(0, 50) + "...");
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected\n");

    // Use the correct collection name
    const User = mongoose.model("User", new mongoose.Schema({
      fullName: String,
      email: String,
      passwordHash: String,
      role: String,
      cnic: String,
      relationToFamily: String,
      status: String,
    }, { timestamps: true, collection: "family_assets" }));

    console.log("📋 Searching in 'family_assets' collection...\n");

    // Find all users
    const users = await User.find({});
    
    if (users.length === 0) {
      console.log("❌ NO USERS FOUND!");
    } else {
      console.log(`✅ Found ${users.length} user(s):\n`);
      
      users.forEach((user, i) => {
        console.log(`${i + 1}. User Details:`);
        console.log("   _id:", user._id);
        console.log("   fullName:", user.fullName);
        console.log("   email:", user.email);
        console.log("   role:", user.role);
        console.log("   passwordHash:", user.passwordHash?.substring(0, 30) + "...");
        console.log("");
      });

      // Test common passwords against first user
      const testUser = users[0];
      console.log("🔐 Testing passwords against user:", testUser.email);
      console.log("━".repeat(60));

      const testPasswords = [
        "admin123",
        "password",
        "12345678",
        "saadi123",
        "saadi",
        "Admin123",
        // Add your Vercel password here if different
      ];

      for (const pwd of testPasswords) {
        const match = await bcrypt.compare(pwd, testUser.passwordHash);
        console.log(`Password "${pwd}": ${match ? "✅ MATCH!" : "❌ no match"}`);
      }
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

checkUser();
