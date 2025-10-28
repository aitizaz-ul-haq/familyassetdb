import mongoose from "mongoose";
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
  relationToFamily: String,
  cnic: String,
  status: String,
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function updateUsers() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI not found in .env.local");
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "family_assets_db",
    });

    console.log("Connected to MongoDB");

    // Update Saadi
    await User.findOneAndUpdate(
      { email: "saadi" },
      {
        relationToFamily: "son",
        cnic: "61101-1844407-5",
        status: "alive"
      }
    );
    console.log("✓ Updated Saadi: son, CNIC: 61101-1844407-5");

    // Update Moon
    await User.findOneAndUpdate(
      { email: "moon" },
      {
        relationToFamily: "son",
        cnic: "",
        status: "alive"
      }
    );
    console.log("✓ Updated Moon: son");

    // Update Papa
    await User.findOneAndUpdate(
      { email: "papa" },
      {
        relationToFamily: "father",
        cnic: "",
        status: "alive"
      }
    );
    console.log("✓ Updated Papa: father");

    console.log("\n✅ All users updated successfully!");

    process.exit(0);
  } catch (error) {
    console.error("Error updating users:", error);
    process.exit(1);
  }
}

updateUsers();
