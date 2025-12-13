const mongoose = require("mongoose");

const clubSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Club name is required"],
    },
    code: {
      type: String,
      required: [true, "Club code is required"],
      uppercase: true,
    },
    description: {
      type: String,
      default: "",
    },
    logo: {
      type: String,
      default: "",
    },
    // null means college-wide club, otherwise branch-specific
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      default: null,
    },
    category: {
      type: String,
      enum: ["technical", "cultural", "sports", "social", "academic", "other"],
      default: "other",
    },
    leads: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        role: {
          type: String,
          enum: ["president", "vicePresident", "secretary", "coordinator"],
          default: "coordinator",
        },
        assignedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    socialLinks: {
      instagram: String,
      linkedin: String,
      website: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for unique club codes within a branch
clubSchema.index({ code: 1, branch: 1 }, { unique: true });

module.exports = mongoose.model("Club", clubSchema);
