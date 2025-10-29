import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import readline from "readline";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, "..", ".env.local") });

async function purgeAssets() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected\n");

    const Asset = mongoose.model("Asset", new mongoose.Schema({}, { strict: false }));

    const count = await Asset.countDocuments();
    
    console.log("⚠️⚠️⚠️  WARNING: This will DELETE ALL ASSETS!");
    console.log("━".repeat(60));
    console.log(`Found ${count} assets in the database`);
    console.log("━".repeat(60));
    
    if (count === 0) {
      console.log("\n✅ No assets to delete. Database is already clean.");
      rl.close();
      await mongoose.disconnect();
      process.exit(0);
    }

    const samples = await Asset.find().limit(5).select("title assetType");
    console.log("\nExample assets that will be deleted:");
    samples.forEach((asset, i) => {
      console.log(`  ${i + 1}. ${asset.title} (${asset.assetType})`);
    });
    if (count > 5) {
      console.log(`  ... and ${count - 5} more\n`);
    }

    const answer = await new Promise((resolve) => {
      rl.question('\nType "DELETE ALL ASSETS" to confirm: ', resolve);
    });

    if (answer.trim() === "DELETE ALL ASSETS") {
      console.log("\n🗑️  Deleting all assets...");
      const result = await Asset.deleteMany({});
      console.log(`✅ Deleted ${result.deletedCount} assets`);
      console.log("\n✅ Database purged successfully!");
      console.log("You can now seed fresh data.");
    } else {
      console.log("\n❌ Cancelled. No assets were deleted.");
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

purgeAssets();
