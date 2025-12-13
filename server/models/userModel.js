const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // ==================== AUTHENTICATION ====================
    name: {
      type: String,
      required: [true, "Please Enter Name"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Please Enter Email"],
      lowercase: true,
    },
    phone: {
      type: String,
      unique: true,
      required: [true, "Please Enter Phone"],
    },
    password: {
      type: String,
      required: [true, "Please Enter Password"],
    },

    // ==================== EMAIL VERIFICATION ====================
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailOTP: {
      code: String,
      expiresAt: Date,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,

    // ==================== ROLE & PERMISSIONS ====================
    role: {
      type: String,
      enum: ["student", "admin", "superadmin"],
      default: "student",
    },
    
    // ==================== BRANCH (For Students) ====================
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
    },
    enrollmentYear: {
      type: Number,
    },
    rollNumber: {
      type: String,
    },

    // ==================== CLUB MEMBERSHIPS ====================
    clubs: [
      {
        club: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Club",
        },
        role: {
          type: String,
          enum: ["member", "coordinator", "secretary", "vicePresident", "president"],
          default: "member",
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    
    // ==================== BADGES ====================
    badges: [
      {
        name: String,
        icon: String,
        description: String,
        earnedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // ==================== ORGANIZATION (For Admins) ====================
    organizationType: {
      type: String,
      enum: ["club", "department", "none"],
      default: "none",
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "organizationType",
    },

    // ==================== PROFILE ====================
    university: {
      type: String,
      default: "Indore Institute of Science and Technology",
    },
    profile: {
      avatar: { type: String, default: "" },
      bio: { type: String, default: "" },
      major: { type: String, default: "" },
      graduationYear: { type: Number },
      preferredMeetupLocations: [String],
      preferredContactMethod: {
        type: String,
        enum: ["in-app", "phone", "email"],
        default: "in-app",
      },
    },

    // ==================== REPUTATION ====================
    reputation: {
      rating: { type: Number, default: 0 },
      totalRatings: { type: Number, default: 0 },
      totalSales: { type: Number, default: 0 },
      totalPurchases: { type: Number, default: 0 },
      avgResponseTime: { type: Number, default: 0 },
    },

    // ==================== SAVED ITEMS ====================
    savedListings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Listing",
      },
    ],
    savedSearches: [
      {
        query: String,
        filters: Object,
        alertsEnabled: { type: Boolean, default: false },
      },
    ],
    blockedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // ==================== STATUS & MODERATION ====================
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    bannedReason: {
      type: String,
      default: "",
    },
    bannedAt: {
      type: Date,
    },
    bannedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // ==================== TRACKING ====================
    lastActive: {
      type: Date,
      default: Date.now,
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

// Middleware to sync isAdmin with role
userSchema.pre("save", function (next) {
  if (this.role === "admin" || this.role === "superadmin") {
    this.isAdmin = true;
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
