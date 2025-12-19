const Event = require("../models/eventModel");
const User = require("../models/userModel");

// @desc    Get all events with visibility filtering
// @route   GET /api/events
// @access  Private
const getEvents = async (req, res) => {
  try {
    const {
      category,
      date,
      type,
      organizer,
      sort,
      limit = 10,
      page = 1,
      branch, // Filter by branch (for admins/superadmins)
    } = req.query;

    let query = {};

    // 1. Basic Filters
    if (category) query.category = category;
    if (type === "free") query.isFree = true;
    if (type === "paid") query.isFree = false;

    // 2. Date Filter
    if (date === "today") {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      query.eventDate = { $gte: start, $lte: end };
    } else if (date === "upcoming") {
      query.eventDate = { $gte: new Date() };
    }

    // 3. Visibility Filtering logic
    // If user is a student, filter based on their branch/clubs
    if (req.user && req.user.role === "student") {
      const userBranch = req.user.branch;
      const userClubs = req.user.clubs.map((c) => c.club);

      query.$or = [
        // Public events (visible to all)
        { "visibility.type": "all" },

        // Branch-specific events
        {
          "visibility.type": "branch",
          "visibility.branches": userBranch,
        },

        // Club-specific events
        {
          "visibility.type": "club",
          "visibility.clubs": { $in: userClubs },
        },
      ];
    }
    // If admin is viewing, filter by their organization scope if needed
    // Super admins see everything unless they filter specifically
    else if (branch) {
      query["visibility.branches"] = branch;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const events = await Event.find(query)
      .populate("organizerId", "name role organizationName")
      .populate("organizerClub", "name logo")
      .populate("category", "name")
      .sort(sort === "date_asc" ? { eventDate: 1 } : { eventDate: 1 }) // Default upcoming first
      .skip(skip)
      .limit(Number(limit));

    const total = await Event.countDocuments(query);

    res.status(200).json({
      events,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      total,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
};

// @desc    Get single event
// @route   GET /api/events/:eid
// @access  Private
const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eid)
      .populate("attendees.user", "name profile")
      .populate("organizerClub", "name logo")
      .populate("visibility.branches", "name code")
      .populate("visibility.clubs", "name")
      .populate("category", "name");

    if (!event) {
      res.status(404);
      throw new Error("Event Not Found!");
    }

    // Check visibility access
    if (req.user && req.user.role === "student" && !req.user.isAdmin) {
      const userBranch = req.user.branch?.toString();
      const userClubs = req.user.clubs.map((c) => c.club.toString());

      const isPublic = event.visibility.type === "all";
      const isBranchVisible =
        event.visibility.type === "branch" &&
        event.visibility.branches.some((b) => b._id.toString() === userBranch);
      const isClubVisible =
        event.visibility.type === "club" &&
        event.visibility.clubs.some(
          (c) => c._id.toString() && userClubs.includes(c._id.toString())
        );

      if (!isPublic && !isBranchVisible && !isClubVisible) {
        res.status(403);
        throw new Error("You do not have permission to view this event");
      }
    }

    res.status(200).json(event);
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    throw new Error(error.message);
  }
};

// @desc    Create event
// @route   POST /api/events
// @access  Private (Admin/Club Lead)
const createEvent = async (req, res) => {
  const {
    eventName,
    eventDescription,
    eventImage,
    eventDate,
    location,
    capacity,
    organizer,
    price,
    category,
    visibility, // { type: 'all'|'branch'|'club', branches: [], clubs: [] }
    organizerClub, // If created on behalf of a club
  } = req.body;

  if (!eventName || !eventDescription || !eventDate || !location) {
    res.status(400);
    throw new Error("Please fill all required fields");
  }

  // Create visibility object
  const visibilitySettings = visibility || {
    type: "all",
    branches: [],
    clubs: [],
  };

  const event = await Event.create({
    eventName,
    eventDescription,
    eventImage,
    eventDate,
    location,
    capacity: capacity || 50,
    organizer,
    price: price || 0,
    category,
    organizerId: req.user._id,
    organizerClub: organizerClub || null,
    visibility: visibilitySettings,
  });

  res.status(201).json(event);
};

// @desc    RSVP to event
// @route   PUT /api/events/:eid/rsvp
// @access  Private
const rsvpEvent = async (req, res) => {
  const event = await Event.findById(req.params.eid);
  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }

  // Check if paid event
  if (!event.isFree) {
    res.status(400);
    throw new Error("This is a paid event. Please complete payment to RSVP.");
  }

  if (event.availableSeats <= 0) {
    res.status(400);
    throw new Error("Event is full");
  }

  // Team Event Logic
  if (event.isTeamEvent) {
    const { teamName, teamMembers } = req.body; // teamMembers is array of emails

    if (!teamName) {
      res.status(400);
      throw new Error("Team Name is required");
    }

    // Include current user in team count
    const teamSize = (teamMembers ? teamMembers.length : 0) + 1;

    if (teamSize < event.minTeamSize || teamSize > event.maxTeamSize) {
      res.status(400);
      throw new Error(
        `Team size must be between ${event.minTeamSize} and ${event.maxTeamSize}`
      );
    }

    if (event.availableSeats < teamSize) {
      res.status(400);
      throw new Error("Not enough seats available for this team");
    }

    // Find users by email
    const memberUsers = [];
    if (teamMembers && teamMembers.length > 0) {
      const users = await User.find({ email: { $in: teamMembers } });
      if (users.length !== teamMembers.length) {
        res.status(400);
        throw new Error(
          "Some team members not found. Please ensure they are registered."
        );
      }
      memberUsers.push(...users);
    }

    // Check if any member (including self) is already registered
    const allTeamUserIds = [req.user._id, ...memberUsers.map((u) => u._id)];

    const alreadyRegistered = event.attendees.some((a) =>
      allTeamUserIds.some((uid) => uid.toString() === a.user.toString())
    );

    if (alreadyRegistered) {
      res.status(400);
      throw new Error(
        "One or more team members are already registered for this event."
      );
    }

    // Add attendees
    event.attendees.push({
      user: req.user._id,
      status: "going",
      teamName,
      isTeamLeader: true,
    });

    memberUsers.forEach((u) => {
      event.attendees.push({
        user: u._id,
        status: "going",
        teamName,
        isTeamLeader: false,
      });
    });

    // Decrement available seats
    event.availableSeats -= teamSize;
  } else {
    // Individual Logic
    const alreadyRSVP = event.attendees.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyRSVP) {
      res.status(400);
      throw new Error("You have already RSVP'd");
    }

    event.attendees.push({ user: req.user._id, status: "going" });
    event.availableSeats -= 1;
  }

  await event.save();

  res.status(200).json(event);
};

module.exports = { getEvent, getEvents, createEvent, rsvpEvent };
