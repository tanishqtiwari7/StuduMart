const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendEmail } = require("../utils/sendEmail");
const User = require("../models/userModel");
const Branch = require("../models/branchModel");
const { sendOTPEmail, generateOTP, sendWelcomeEmail } = require("../utils/sendEmail");

// Generate Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "15d" });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    let { name, email, phone, password, branch, enrollmentYear, rollNumber } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !password) {
      res.status(400);
      throw new Error("Please fill all required details");
    }

    // Enforce @acropolis.in email domain with Regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@acropolis\.in$/;
    if (!emailRegex.test(email)) {
      res.status(400);
      throw new Error("Only @acropolis.in emails are allowed");
    }

    // Validate phone number
    if (phone.length !== 10) {
      res.status(400);
      throw new Error("Please enter a valid 10-digit phone number");
    }

    // Check if user already exists
    const emailExist = await User.findOne({ email: email.toLowerCase() });
    const phoneExist = await User.findOne({ phone });

    if (emailExist) {
      // If email exists but not verified, allow re-registration
      if (!emailExist.isEmailVerified) {
        // Generate new OTP
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        emailExist.emailOTP = { code: otp, expiresAt: otpExpiry };
        emailExist.name = name;
        emailExist.phone = phone;
        
        // Re-hash password
        const salt = await bcrypt.genSalt(10);
        emailExist.password = await bcrypt.hash(password, salt);
        
        if (branch) emailExist.branch = branch;
        if (enrollmentYear) emailExist.enrollmentYear = enrollmentYear;
        if (rollNumber) emailExist.rollNumber = rollNumber;
        
        await emailExist.save();

        // Send OTP email
        await sendOTPEmail(email, otp, name);

        return res.status(200).json({
          message: "OTP sent to your email for verification",
          email: email,
          requiresVerification: true,
        });
      }
      res.status(409); // Conflict
      throw new Error("This email is already registered. Please login instead.");
    }

    if (phoneExist) {
      res.status(400);
      throw new Error("Phone number already registered");
    }

    // Validate branch if provided
    if (branch) {
      const branchExists = await Branch.findById(branch);
      if (!branchExists) {
        res.status(400);
        throw new Error("Invalid branch selected");
      }
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create User (unverified)
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      password: hashedPassword,
      role: "student",
      branch: branch || null,
      enrollmentYear: enrollmentYear || null,
      rollNumber: rollNumber || null,
      isEmailVerified: false,
      emailOTP: {
        code: otp,
        expiresAt: otpExpiry,
      },
    });

    if (!user) {
      res.status(400);
      throw new Error("Failed to create user");
    }

    // Send OTP email
    await sendOTPEmail(email, otp, name);

    res.status(201).json({
      message: "Registration successful! Please verify your email.",
      email: user.email,
      requiresVerification: true,
    });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    throw new Error(error.message);
  }
};

// @desc    Verify email with OTP
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      res.status(400);
      throw new Error("Email and OTP are required");
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    if (user.isEmailVerified) {
      res.status(400);
      throw new Error("Email is already verified");
    }

    if (!user.emailOTP || !user.emailOTP.code) {
      res.status(400);
      throw new Error("No OTP found. Please request a new one.");
    }

    // Check if OTP has expired
    if (new Date() > new Date(user.emailOTP.expiresAt)) {
      res.status(400);
      throw new Error("OTP has expired. Please request a new one.");
    }

    // Verify OTP
    if (user.emailOTP.code !== otp) {
      res.status(400);
      throw new Error("Invalid OTP");
    }

    // Mark email as verified
    user.isEmailVerified = true;
    user.emailOTP = undefined; // Clear OTP
    await user.save();

    // Send welcome email (non-blocking)
    sendWelcomeEmail(user.email, user.name);

    // Generate token and return user data
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      branch: user.branch,
      isEmailVerified: user.isEmailVerified,
      isActive: user.isActive,
      isAdmin: user.isAdmin,
      createdAt: user.createdAt,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    throw new Error(error.message);
  }
};

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400);
      throw new Error("Email is required");
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    if (user.isEmailVerified) {
      res.status(400);
      throw new Error("Email is already verified");
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    user.emailOTP = { code: otp, expiresAt: otpExpiry };
    await user.save();

    // Send OTP email
    await sendOTPEmail(email, otp, user.name);

    res.status(200).json({
      message: "New OTP sent to your email",
      email: user.email,
    });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    throw new Error(error.message);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error("Please fill all details");
    }

    const user = await User.findOne({ email: email.toLowerCase() })
      .populate("branch", "name code");

    if (!user) {
      res.status(401);
      throw new Error("We couldn't find an account with that email.");
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401);
      throw new Error("Incorrect password. Please try again or reset it.");
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      // Generate new OTP and send
      const otp = generateOTP();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
      
      user.emailOTP = { code: otp, expiresAt: otpExpiry };
      await user.save();
      
      await sendOTPEmail(user.email, otp, user.name);

      return res.status(403).json({
        message: "Email not verified. A new OTP has been sent.",
        email: user.email,
        requiresVerification: true,
      });
    }

    // Check if account is active
    if (!user.isActive) {
      res.status(401);
      throw new Error("Account has been disabled. Contact admin.");
    }

    // Update last active
    user.lastActive = new Date();
    await user.save();

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      branch: user.branch,
      university: user.university,
      profile: user.profile,
      clubs: user.clubs,
      badges: user.badges,
      reputation: user.reputation,
      isEmailVerified: user.isEmailVerified,
      isActive: user.isActive,
      isAdmin: user.isAdmin,
      createdAt: user.createdAt,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    throw new Error(error.message);
  }
};

// @desc    Get user profile by ID
// @route   GET /api/auth/profile/:id
// @access  Public
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password -emailOTP")
      .populate("branch", "name code")
      .populate("clubs.club", "name code logo");

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(404);
    throw new Error("User not found");
  }
};

// @desc    Get all branches (for registration dropdown)
// @route   GET /api/auth/branches
// @access  Public
const getBranches = async (req, res) => {
  try {
    const branches = await Branch.find({ isActive: true })
      .select("name code degree")
      .sort({ code: 1 });
    res.status(200).json(branches);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
};

// @desc    Private route test
// @route   GET /api/auth/private
// @access  Private
const privateController = async (req, res) => {
  res.json({
    msg: "Private Route - Logged in users only",
    user: req.user,
  });
};

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404);
      throw new Error("Email could not be sent");
    }

    // Generate Token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hash token and save to DB
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 Minutes

    await user.save();

    // Create reset url
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    const message = `
      <h1>You have requested a password reset</h1>
      <p>Please go to this link to reset your password:</p>
      <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
    `;

    try {
      await sendEmail({
        to: user.email,
        subject: "Password Reset Request",
        text: message,
      });

      res.status(200).json({ success: true, data: "Email Sent" });
    } catch (error) {
      console.log(error);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      res.status(500);
      throw new Error("Email could not be sent");
    }
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    throw new Error(error.message);
  }
};

// @desc    Reset Password
// @route   PUT /api/auth/reset-password/:resetToken
// @access  Public
const resetPassword = async (req, res) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      res.status(400);
      throw new Error("Invalid Token");
    }

    // Set new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
    
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      data: "Password Reset Success",
    });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    throw new Error(error.message);
  }
};

module.exports = {
  registerUser,
  loginUser,
  verifyOTP,
  resendOTP,
  getUserProfile,
  getBranches,
  privateController,
  forgotPassword,
  resetPassword,
};
