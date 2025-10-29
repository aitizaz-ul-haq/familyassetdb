import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, "..", ".env.local") });

async function diagnose() {
  try {
    console.log("🔍 DIAGNOSTIC CHECK\n");
    console.log("Connecting to:", process.env.MONGODB_URI?.substring(0, 50) + "...\n");
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    const db = mongoose.connection.db;
    
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log("📚 Collections in database:");
    collections.forEach(col => console.log(`   - ${col.name}`));
    console.log("");

    // Check users
    const User = mongoose.model("User", new mongoose.Schema({}, { strict: false }));
    const users = await User.find({}).limit(5);
    console.log(`👥 Users found: ${users.length}`);
    users.forEach(u => console.log(`   - ${u.fullName} (${u.email})`));
    console.log("");

    // Check assets
    const Asset = mongoose.model("Asset", new mongoose.Schema({}, { strict: false }));
    const assets = await Asset.find({}).limit(5);
    console.log(`🏢 Assets found: ${assets.length}`);
    assets.forEach(a => {
      console.log(`   - ${a.title} (${a.assetType})`);
      console.log(`     Owners: ${a.owners?.length || 0}`);
      console.log(`     Contacts: ${a.relatedContacts?.length || 0}`);
      console.log(`     Documents: ${a.documents?.length || 0}`);
    });
    console.log("");

    // Check one asset in detail
    if (assets.length > 0) {
      const firstAsset = assets[0];
      console.log("🔎 First Asset Details:");
      console.log(JSON.stringify(firstAsset, null, 2));
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

diagnose();
