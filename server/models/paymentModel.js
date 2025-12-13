const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    // Who paid
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // What they paid for
    paymentFor: {
      type: String,
      enum: ["event", "listing", "club_membership", "other"],
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
    },

    // Payment details
    amount: {
      type: Number,
      required: [true, "Amount is required"],
    },
    currency: {
      type: String,
      default: "INR",
    },

    // Razorpay fields
    razorpayOrderId: {
      type: String,
      required: true,
    },
    razorpayPaymentId: {
      type: String,
    },
    razorpaySignature: {
      type: String,
    },

    // Status
    status: {
      type: String,
      enum: ["created", "pending", "paid", "failed", "refunded"],
      default: "created",
    },

    // Verification
    verifiedAt: Date,
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // Additional info
    notes: {
      type: String,
      default: "",
    },
    metadata: {
      type: Map,
      of: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
paymentSchema.index({ user: 1, status: 1 });
paymentSchema.index({ razorpayOrderId: 1 });
paymentSchema.index({ event: 1 });

module.exports = mongoose.model("Payment", paymentSchema);
