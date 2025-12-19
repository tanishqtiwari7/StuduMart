const Message = require("../models/messageModel");
const Listing = require("../models/listingModel");
const User = require("../models/userModel");
const { sendBuyerEmail } = require("../utils/sendEmail");

const getMessages = async (req, res) => {
  try {
    // Get all listing IDs created by the logged-in user
    const myListingIds = await Listing.find({ user: req.user._id }).distinct(
      "_id"
    );

    // Fetch only messages whose listing matches user's listings
    const messages = await Message.find({
      listing: { $in: myListingIds },
    })
      .populate("user")
      .populate("listing");

    if (!messages) {
      return res.status(404).json({ message: "No messages found!" });
    }

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const sendMessage = async (req, res) => {
  if (!req.body.text) {
    res.status(400);
    throw new Error("Please Add Text!");
  }

  const newMessage = await Message.create({
    text: req.body.text,
    user: req.user._id,
    listing: req.params.pid,
  });

  if (!newMessage) {
    res.status(400);
    throw new Error("Message Not Sent!");
  }

  // Populate user and listing before sending response
  const populatedMessage = await Message.findById(newMessage._id)
    .populate("user")
    .populate("listing");

  res.status(201).json(populatedMessage);
};

const sendEmailToBuyerController = async (req, res) => {
  const { buyerId, subject, message } = req.body;

  if (!buyerId || !subject || !message) {
    res.status(400);
    throw new Error("Please provide all fields");
  }

  const buyer = await User.findById(buyerId);
  if (!buyer) {
    res.status(404);
    throw new Error("Buyer not found");
  }

  await sendBuyerEmail(
    buyer.email,
    subject,
    message,
    req.user.name,
    req.user.email
  );

  res.status(200).json({ message: "Email sent successfully" });
};

module.exports = { getMessages, sendMessage, sendEmailToBuyerController };
