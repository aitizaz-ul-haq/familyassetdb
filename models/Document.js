import mongoose from "mongoose";

const DocumentSchema = new mongoose.Schema(
  {
    assetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Asset",
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    docType: {
      type: String,
      enum: ["ownership", "mutation", "tax", "map", "legal", "photo", "other"],
      default: "other",
    },
    fileType: {
      type: String,
      enum: ["pdf", "jpeg", "jpg", "png", "doc", "other"],
    },
    issuedBy: {
      type: String,
    },
    issueDate: {
      type: Date,
    },
    notes: {
      type: String,
    },
    isCritical: {
      type: Boolean,
      default: false,
    },
    uploadedBy: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Document || mongoose.model("Document", DocumentSchema);
