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
  relationToFamily: String,
  cnic: String,
  status: String,
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function seedUsers() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI not found in .env.local");
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "family_assets_db",
    });

    console.log("Connected to MongoDB");

    // Define the four users with additional info
    const users = [
      {
        fullName: "Saadi",
        email: "saadi",
        password: "saadi123",
        role: "admin", // Super admin
        relationToFamily: "son",
        cnic: "61101-1844407-5",
        status: "alive",
      },
      {
        fullName: "Moon",
        email: "moon",
        password: "moon123",
        role: "viewer",
        relationToFamily: "son",
        cnic: "",
        status: "alive",
      },
      {
        fullName: "Papa",
        email: "papa",
        password: "papa123",
        role: "viewer",
        relationToFamily: "father",
        cnic: "",
        status: "alive",
      },
      {
        fullName: "Samina Nawaz",
        email: "samina",
        password: "samina123",
        role: "viewer",
        relationToFamily: "mother",
        cnic: "",
        status: "deceased",
      },
    ];

    const saltRounds = 10;

    for (const userData of users) {
      const existingUser = await User.findOne({ email: userData.email });
      
      if (existingUser) {
        console.log(`User ${userData.email} already exists. Skipping...`);
        continue;
      }

      const passwordHash = await bcrypt.hash(userData.password, saltRounds);

      await User.create({
        fullName: userData.fullName,
        email: userData.email,
        passwordHash,
        role: userData.role,
        relationToFamily: userData.relationToFamily,
        cnic: userData.cnic,
        status: userData.status,
      });

      console.log(`✓ Created user: ${userData.fullName} (${userData.email}) - Role: ${userData.role}`);
      console.log(`  Password: ${userData.password}`);
    }

    console.log("\n✅ User seeding completed successfully!");
    console.log("\nLogin Credentials:");
    console.log("==================");
    console.log("Super Admin:");
    console.log("  Username: saadi");
    console.log("  Password: saadi123");
    console.log("\nViewers:");
    console.log("  Username: moon | Password: moon123");
    console.log("  Username: papa | Password: papa123");
    console.log("  Username: samina | Password: samina123 (deceased)");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding users:", error);
    process.exit(1);
  }
}

seedUsers();
