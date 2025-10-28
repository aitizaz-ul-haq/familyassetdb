import mongoose from "mongoose";

const AssetSchema = new mongoose.Schema(
  {
    assetType: {
      type: String,
      enum: ["land_plot", "house", "apartment", "vehicle", "business_share", "other"],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    location: {
      country: String,
      city: String,
      areaOrSector: String,
      addressDetails: String,
      geoCoordinates: {
        lat: Number,
        lng: Number,
      },
    },
    currentStatus: {
      type: String,
      enum: ["clean", "in_dispute", "under_transfer", "sold_but_not_cleared", "unknown"],
      default: "clean",
    },
    owners: [
      {
        personId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Person",
          required: true,
        },
        percentage: {
          type: Number,
          required: true,
        },
        ownershipType: {
          type: String,
        },
      },
    ],
    acquisitionInfo: {
      acquiredDate: Date,
      acquiredFrom: String,
      method: {
        type: String,
        enum: ["purchased", "gifted", "inherited", "transferred", "settlement", "other"],
      },
      priceOrValueAtAcquisition: Number,
      notes: String,
    },
    disputeInfo: {
      isInDispute: {
        type: Boolean,
        default: false,
      },
      type: String,
      startedDate: Date,
      details: String,
      lawyerName: String,
      caseNumber: String,
      nextHearingDate: Date,
    },
    documents: [
      {
        label: {
          type: String,
          required: true,
        },
        fileUrl: {
          type: String,
          required: true,
        },
        notes: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    history: [
      {
        date: {
          type: Date,
          default: Date.now,
        },
        action: {
          type: String,
          required: true,
        },
        details: String,
      },
    ],
    tags: [String],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Asset || mongoose.model("Asset", AssetSchema);
