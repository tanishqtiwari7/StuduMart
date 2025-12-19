const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    eventName: {
      type: String,
      required: [true, "Please Fill Event Name"],
    },
    eventDescription: {
      type: String,
      required: [true, "Please Fill Event Description"],
    },
    eventImage: {
      type: String,
      required: [true, "Please Fill Event Image URL"],
    },
    eventDate: {
      type: Date,
      required: [true, "Please Fill Event Date"],
    },
    endTime: {
      type: Date,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Please Select Event Category"],
    },
    status: {
      type: String,
      enum: ["upcoming", "completed", "ongoing", "postponed", "cancelled"],
      required: true,
      default: "upcoming",
    },
    location: {
      type: String,
      required: [true, "Please Fill Event Location"],
    },

    // Capacity management
    capacity: {
      type: Number,
      required: [true, "Please Fill Event Capacity"],
      default: 50,
    },
    availableSeats: {
      type: Number,
      default: 50,
    },

    // Organizer info
    organizer: {
      type: String,
      required: [true, "Please Fill Event Organizer Name"],
    },
    organizerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    organizerClub: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
    },

    // ==================== VISIBILITY SETTINGS ====================
    visibility: {
      type: {
        type: String,
        enum: ["all", "branch", "club"],
        default: "all",
      },
      // Only students from these branches can see the event
      branches: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Branch",
        },
      ],
      // Only members of these clubs can see the event
      clubs: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Club",
        },
      ],
    },

    // Attendees
    attendees: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        status: {
          type: String,
          enum: ["going", "interested", "paid"],
          default: "going",
        },
        paymentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Payment",
        },
        rsvpDate: { type: Date, default: Date.now },
        teamName: String,
        isTeamLeader: { type: Boolean, default: false },
      },
    ],

    // Pricing
    price: {
      type: Number,
      required: [true, "Please Fill Event Price"],
      default: 0,
    },

    // Team Event Settings
    isTeamEvent: {
      type: Boolean,
      default: false,
    },
    teamPrice: {
      type: Number,
      default: 0,
    },
    minTeamSize: {
      type: Number,
      default: 1,
    },
    maxTeamSize: {
      type: Number,
      default: 1,
    },

    isFree: {
      type: Boolean,
      default: true,
    },

    // Additional info
    tags: [String],
    registrationDeadline: Date,
    contactEmail: String,
    contactPhone: String,
    externalLink: String,
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware
eventSchema.pre("save", function (next) {
  // Update available seats
  if (this.capacity && this.attendees) {
    const goingCount = this.attendees.filter(
      (a) => a.status === "going" || a.status === "paid"
    ).length;
    this.availableSeats = Math.max(0, this.capacity - goingCount);
  }

  // Set isFree based on price
  this.isFree = this.price === 0;

  // Initialize visibility if not set
  if (!this.visibility) {
    this.visibility = { type: "all", branches: [], clubs: [] };
  }

  next();
});

// Index for efficient queries
eventSchema.index({ eventDate: 1, status: 1 });
eventSchema.index({ "visibility.type": 1, "visibility.branches": 1 });

module.exports = mongoose.model("Event", eventSchema);
