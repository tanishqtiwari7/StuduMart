const User = require("../models/userModel");
const Event = require("../models/eventModel");
const Listing = require("../models/listingModel");
const Comment = require("../models/commentModel");

const getAllUsers = async (req, res) => {
  let query = {};

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
    !price ||
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

module.exports = {
  getAllUsers,
  getAllListings,
  updateUser,
  addEvent,
  updateEvent,
  updateProductListing,
  getAllComments,
};
