const User = require("../models/userModel");
const Event = require("../models/eventModel");
const Listing = require("../models/listingModel");
const Comment = require("../models/commentModel");

const getAllUsers = async (req, res) => {
  let query = { isEmailVerified: true }; // Only show verified users

  // Filter for Branch Admins
  if (req.user.organizationType === "Branch" && req.user.organizationId) {
    query.branch = req.user.organizationId;
  }

  const users = await User.find(query).populate("branch");
  if (!users) {
    res.status(404);
    throw new Error("Users Not Found!");
  }
  res.status(200).json(users);
};

const getAllListings = async (req, res) => {
  let query = {};

  // Filter for Branch Admins
  if (req.user.organizationType === "Branch" && req.user.organizationId) {
    // Find all users in this branch
    const branchUsers = await User.find({
      branch: req.user.organizationId,
    }).select("_id");
    const branchUserIds = branchUsers.map((u) => u._id);
    query.user = { $in: branchUserIds };
  }

  // Super Admin sees all (query remains empty)

  const listings = await Listing.find(query)
    .populate("user", "name email branch")
    .populate("category", "name")
    .sort({ status: -1, createdAt: -1 }); // Pending first (if 'pending' > 'approved' alphabetically? No. 'pending' > 'approved' is true. 'rejected' > 'pending'. We might need custom sort or just sort by date)

  // Better sort: Pending first
  const sortedListings = listings.sort((a, b) => {
    if (a.status === "pending" && b.status !== "pending") return -1;
    if (a.status !== "pending" && b.status === "pending") return 1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  res.status(200).json(sortedListings);
};

const updateUser = async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(req.params.uid, req.body, {
    new: true,
  });

  if (!updatedUser) {
    res.status(400);
    throw new Error("User Not Updated");
  }

  res.status(200).json(updatedUser);
};

const addEvent = async (req, res) => {
  const {
    eventName,
    eventDescription,
    eventImage,
    eventDate,
    status,
    location,
    availableSeats,
    organizer,
    price,
    category,
    capacity,
    isTeamEvent,
    teamPrice,
    minTeamSize,
    maxTeamSize,
  } = req.body;

  if (
    !eventName ||
    !eventDescription ||
    !eventImage ||
    !eventDate ||
    !status ||
    !location ||
    !availableSeats ||
    !organizer ||
    price === undefined ||
    !category
  ) {
    res.status(400);
    throw new Error("Please Fill Details");
  }

  let newEvent = await Event.create({
    eventName,
    eventDescription,
    eventImage,
    eventDate,
    status,
    location,
    availableSeats,
    capacity: capacity || availableSeats,
    organizer,
    organizerId: req.user._id,
    price,
    category,
    isTeamEvent: isTeamEvent || false,
    teamPrice: teamPrice || 0,
    minTeamSize: minTeamSize || 1,
    maxTeamSize: maxTeamSize || 1,
    visibility: { type: "all", branches: [], clubs: [] },
  });

  if (!newEvent) {
    res.status(400);
    throw new Error("Event Not Created");
  }

  res.status(201).json(newEvent);
};

const updateEvent = async (req, res) => {
  const updatedEvent = await Event.findByIdAndUpdate(req.params.eid, req.body, {
    new: true,
  });

  if (!updatedEvent) {
    res.status(400);
    throw new Error("Event Not Updated");
  }

  res.status(200).json(updatedEvent);
};

const updateProductListing = async (req, res) => {
  const updatedListing = await Listing.findByIdAndUpdate(
    req.params.pid,
    req.body,
    { new: true }
  ).populate("user");

  if (!updatedListing) {
    res.status(404);
    throw new Error("Product Not Updated!");
  }

  res.status(200).json(updatedListing);
};

const getAllComments = async (req, res) => {
  const comments = await Comment.find().populate("user").populate("event");
  if (!comments) {
    res.status(404);
    throw new Error("Comments Not Found!");
  }

  res.status(200).json(comments);
};

const inviteUser = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    res.status(400);
    throw new Error("User ID is required");
  }

  const userToInvite = await User.findById(userId);
  if (!userToInvite) {
    res.status(404);
    throw new Error("User not found");
  }

  // Check if requester is a Club Admin
  if (req.user.organizationType !== "Club" || !req.user.organizationId) {
    res.status(403);
    throw new Error("Only Club Admins can invite users");
  }

  // Fetch Club Name
  // Assuming organizationId is populated or we need to fetch it.
  // In authMiddleware, we might not populate it fully. Let's fetch the club.
  const Club = require("../models/clubModel");
  const club = await Club.findById(req.user.organizationId);

  if (!club) {
    res.status(404);
    throw new Error("Club not found");
  }

  const { sendInviteEmail } = require("../utils/sendEmail");

  await sendInviteEmail(userToInvite.email, club.name, req.user.name);

  res.status(200).json({ message: `Invitation sent to ${userToInvite.name}` });
};

module.exports = {
  getAllUsers,
  getAllListings,
  updateUser,
  addEvent,
  updateEvent,
  updateProductListing,
  getAllComments,
  inviteUser,
};
