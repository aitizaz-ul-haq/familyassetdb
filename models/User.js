import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["super_admin", "admin", "viewer"],
      default: "viewer",
    },
    relationToFamily: {
      type: String,
    },
    cnic: {
      type: String,
    },
    status: {
      type: String,
      enum: ["alive", "deceased"],
      default: "alive",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
