const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please Fill Product Name"],
    },
    description: {
      type: String,
      required: [true, "Please Fill Product Description"],
    },
    category: {
      type: String,
      enum: [
        "electronics",
        "textbooks",
        "furniture",
        "clothing",
        "tickets",
        "free",
        "other",
      ],
      default: "other",
    },
    price: {
      type: Number, // Changed from String to Number for calculations
      required: [true, "Please Fill Product Price"],
    },
    currency: {
      type: String,
      default: "INR",
    },
    condition: {
      type: String,
      enum: ["new", "like-new", "good", "fair", "for-parts"],
      default: "good",
    },
    images: [
      {
        url: String,
        caption: String,
        isPrimary: Boolean,
      },
    ],
    // Legacy field support - will be populated from images[0] if empty
    itemImage: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    location: {
      campus: { type: String, default: "Main" },
      building: String,
      meetupPreference: String,
    },
    specifications: {
      type: Map,
      of: String,
    },
    status: {
      type: String,
      enum: ["active", "sold", "pending", "expired", "removed"],
      default: "active",
    },
    isAvailable: {
      // Legacy support
      type: Boolean,
      default: true,
    },
    views: { type: Number, default: 0 },
    favorites: { type: Number, default: 0 },
    tags: [String],
    expiresAt: Date,
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to ensure itemImage is set for backward compatibility
listingSchema.pre("save", function (next) {
  if (this.images && this.images.length > 0 && !this.itemImage) {
    this.itemImage = this.images[0].url;
  }
  // Sync isAvailable with status
  if (this.status === "active") {
    this.isAvailable = true;
  } else {
    this.isAvailable = false;
  }
  next();
});

module.exports = mongoose.model("Listing", listingSchema);
