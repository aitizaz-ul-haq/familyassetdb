import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import readline from "readline";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, "..", ".env.local") });

async function purgeAll() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected\n");

    const Asset = mongoose.model("Asset", new mongoose.Schema({}, { strict: false }));
    const Person = mongoose.model("Person", new mongoose.Schema({}, { strict: false }));
    // Note: We DON'T delete Users so you can still login

    const assetCount = await Asset.countDocuments();
    const personCount = await Person.countDocuments();

    console.log("⚠️⚠️⚠️  DANGER: This will delete ALL data (except Users)!");
    console.log("━".repeat(60));
    console.log(`Assets to delete: ${assetCount}`);
    console.log(`People to delete: ${personCount}`);
    console.log("━".repeat(60));
    console.log("ℹ️  Users will NOT be deleted (so you can still login)\n");

    const answer = await new Promise((resolve) => {
      rl.question('Type "PURGE EVERYTHING" to confirm: ', resolve);
    });

    if (answer.trim() === "PURGE EVERYTHING") {
      console.log("\n🗑️  Purging all data...");
      
      const assetsDeleted = await Asset.deleteMany({});
      console.log(`✅ Deleted ${assetsDeleted.deletedCount} assets`);
      
      const peopleDeleted = await Person.deleteMany({});
      console.log(`✅ Deleted ${peopleDeleted.deletedCount} people`);
      
      console.log("\n✅ All data purged successfully!");
      console.log("You can now start fresh with complete data.");
    } else {
      console.log("\n❌ Cancelled. No data was deleted.");
    }

    rl.close();
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    rl.close();
    process.exit(1);
  }
}

purgeAll();
