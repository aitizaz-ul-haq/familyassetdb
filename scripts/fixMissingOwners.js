import mongoose from "mongoose";
import { connectDB } from "../lib/db.js";
import Asset from "../models/Asset.js";
import Person from "../models/Person.js";

async function fixMissingOwners() {
  await connectDB();

  // Create or find "Unknown Owner" person
  let unknownOwner = await Person.findOne({ fullName: "Unknown Owner" });
  
  if (!unknownOwner) {
    unknownOwner = await Person.create({
      fullName: "Unknown Owner",
      relationToFamily: "unknown",
      status: "alive",
      notes: "Placeholder for assets with unspecified owners"
    });
    console.log("✅ Created Unknown Owner person:", unknownOwner._id);
  }

  // Find all assets without owners or with empty owners array
  const assetsWithoutOwners = await Asset.find({
    $or: [
      { owners: { $exists: false } },
      { owners: { $size: 0 } }
    ]
  });

  console.log(`Found ${assetsWithoutOwners.length} assets without owners`);

  // Add Unknown Owner to each
  for (const asset of assetsWithoutOwners) {
    asset.owners = [{
      personId: unknownOwner._id,
      percentage: 100,
      ownershipType: "legal_owner"
    }];
    await asset.save();
    console.log(`✅ Fixed: ${asset.title}`);
  }

  console.log("✅ Done! All assets now have owners.");
  process.exit(0);
}

fixMissingOwners().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
