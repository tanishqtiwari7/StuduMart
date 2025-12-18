const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
    },
    type: {
      type: String,
      enum: ["event", "listing", "club"],
      required: [true, "Category type is required"],
    },
    description: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure unique names per type
categorySchema.index({ name: 1, type: 1 }, { unique: true });

module.exports = mongoose.model("Category", categorySchema);
