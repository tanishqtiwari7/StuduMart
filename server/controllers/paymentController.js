const Razorpay = require("razorpay");
const crypto = require("crypto");
const Payment = require("../models/paymentModel");
const Event = require("../models/eventModel");
const User = require("../models/userModel");

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create a payment order for event
// @route   POST /api/payments/create-order
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { eventId, amount } = req.body;

    if (!eventId || !amount) {
      res.status(400);
      throw new Error("Event ID and amount are required");
    }

    // Verify event exists
    const event = await Event.findById(eventId);
    if (!event) {
      res.status(404);
      throw new Error("Event not found");
    }

    // Check if user already has a successful payment for this event
    const existingPayment = await Payment.findOne({
      user: req.user._id,
      event: eventId,
      status: "paid",
    });

    if (existingPayment) {
      res.status(400);
      throw new Error("You have already paid for this event");
    }

    // Create Razorpay order
    const options = {
      amount: Math.round(amount * 100), // Razorpay expects amount in paise
      currency: "INR",
      receipt: `event_${eventId}_${Date.now()}`,
      notes: {
        eventId: eventId,
        userId: req.user._id.toString(),
        eventName: event.eventName,
      },
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Save payment record
    const payment = await Payment.create({
      user: req.user._id,
      paymentFor: "event",
      event: eventId,
      amount: amount,
      razorpayOrderId: razorpayOrder.id,
      status: "created",
    });

    res.status(201).json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      paymentId: payment._id,
      key: process.env.RAZORPAY_KEY_ID,
      eventName: event.eventName,
      userName: req.user.name,
      userEmail: req.user.email,
      userPhone: req.user.phone,
    });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    throw new Error(error.message);
  }
};

// @desc    Verify payment after Razorpay callback
// @route   POST /api/payments/verify
// @access  Private
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      res.status(400);
      throw new Error("Payment verification details are required");
    }

    // Find payment record
    const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });

    if (!payment) {
      res.status(404);
      throw new Error("Payment record not found");
    }

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      payment.status = "failed";
      await payment.save();
      res.status(400);
      throw new Error("Payment verification failed - Invalid signature");
    }

    // Update payment record
    payment.razorpayPaymentId = razorpay_payment_id;
    payment.razorpaySignature = razorpay_signature;
    payment.status = "paid";
    payment.verifiedAt = new Date();
    await payment.save();

    // If event payment, add user to attendees
    if (payment.paymentFor === "event" && payment.event) {
      const event = await Event.findById(payment.event);
      if (event) {
        const alreadyAttending = event.attendees.find(
          (a) => a.user.toString() === payment.user.toString()
        );
        if (!alreadyAttending) {
          event.attendees.push({
            user: payment.user,
            status: "going",
            rsvpDate: new Date(),
          });
          await event.save();
        }
      }
    }

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      payment: {
        id: payment._id,
        status: payment.status,
        amount: payment.amount,
        paymentId: payment.razorpayPaymentId,
      },
    });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    throw new Error(error.message);
  }
};

// @desc    Get user's payment history
// @route   GET /api/payments/my
// @access  Private
const getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id })
      .populate("event", "eventName eventDate eventImage")
      .sort({ createdAt: -1 });

    res.status(200).json(payments);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
};

// @desc    Get payment by ID
// @route   GET /api/payments/:id
// @access  Private
const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate("user", "name email phone")
      .populate("event", "eventName eventDate eventImage price");

    if (!payment) {
      res.status(404);
      throw new Error("Payment not found");
    }

    // Only allow user or admin to view
    if (
      payment.user._id.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      res.status(403);
      throw new Error("Not authorized to view this payment");
    }

    res.status(200).json(payment);
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    throw new Error(error.message);
  }
};

// @desc    Get all payments (Admin only)
// @route   GET /api/payments/admin/all
// @access  Admin
const getAllPayments = async (req, res) => {
  try {
    const { status, eventId, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status) query.status = status;
    if (eventId) query.event = eventId;

    const skip = (page - 1) * limit;

    const payments = await Payment.find(query)
      .populate("user", "name email phone branch")
      .populate("event", "eventName eventDate")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Payment.countDocuments(query);

    res.status(200).json({
      payments,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
};

// @desc    Get Razorpay key (for frontend)
// @route   GET /api/payments/key
// @access  Private
const getRazorpayKey = async (req, res) => {
  res.status(200).json({ key: process.env.RAZORPAY_KEY_ID });
};

module.exports = {
  createOrder,
  verifyPayment,
  getMyPayments,
  getPaymentById,
  getAllPayments,
  getRazorpayKey,
};
