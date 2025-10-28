import mongoose from "mongoose";

const PersonSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    fatherName: {
      type: String,
    },
    cnic: {
      type: String,
    },
    relationToFamily: {
      type: String,
    },
    status: {
      type: String,
      enum: ["alive", "deceased"],
      default: "alive",
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Person || mongoose.model("Person", PersonSchema);
