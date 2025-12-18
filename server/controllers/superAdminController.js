const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const Branch = require("../models/branchModel");
const Club = require("../models/clubModel");
const Listing = require("../models/listingModel");
const Event = require("../models/eventModel");

// ==================== BRANCH MANAGEMENT ====================

// @desc    Get all branches
// @route   GET /api/superadmin/branches
// @access  Super Admin
const getAllBranches = async (req, res) => {
  try {
    const branches = await Branch.find()
      .populate("createdBy", "name email")
      .sort({ code: 1 });
    res.status(200).json(branches);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
};

// @desc    Create a new branch
// @route   POST /api/superadmin/branches
// @access  Super Admin
const createBranch = async (req, res) => {
  try {
    const { name, code, department, degree, description } = req.body;

    if (!name || !code) {
      res.status(400);
      throw new Error("Branch name and code are required");
    }

    // Check if branch already exists
    const existingBranch = await Branch.findOne({
      $or: [{ name }, { code: code.toUpperCase() }],
    });

    if (existingBranch) {
      res.status(400);
      throw new Error("Branch with this name or code already exists");
    }

    const branch = await Branch.create({
      name,
      code: code.toUpperCase(),
      department: department || "Engineering",
      degree: degree || "B.Tech",
      description,
      createdBy: req.user._id,
    });

    res.status(201).json(branch);
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    throw new Error(error.message);
  }
};

// @desc    Update a branch
// @route   PUT /api/superadmin/branches/:id
// @access  Super Admin
const updateBranch = async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id);

    if (!branch) {
      res.status(404);
      throw new Error("Branch not found");
    }

    const updatedBranch = await Branch.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedBranch);
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    throw new Error(error.message);
  }
};

// @desc    Delete a branch
// @route   DELETE /api/superadmin/branches/:id
// @access  Super Admin
const deleteBranch = async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id);

    if (!branch) {
      res.status(404);
      throw new Error("Branch not found");
    }

    // Check if any users belong to this branch
    const usersInBranch = await User.countDocuments({ branch: req.params.id });
    if (usersInBranch > 0) {
      res.status(400);
      throw new Error(
        `Cannot delete: ${usersInBranch} users belong to this branch`
      );
    }

    await Branch.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ message: "Branch deleted successfully", id: req.params.id });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    throw new Error(error.message);
  }
};

// ==================== CLUB MANAGEMENT ====================

// @desc    Get all clubs
// @route   GET /api/superadmin/clubs
// @access  Super Admin
const getAllClubs = async (req, res) => {
  try {
    const clubs = await Club.find()
      .populate("branch", "name code")
      .populate("createdBy", "name email")
      .populate("leads.user", "name email")
      .sort({ name: 1 });
    res.status(200).json(clubs);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
};

// @desc    Create a new club
// @route   POST /api/superadmin/clubs
// @access  Super Admin
const createClub = async (req, res) => {
  try {
    const { name, code, description, logo, branch, category, socialLinks } =
      req.body;

    if (!name || !code) {
      res.status(400);
      throw new Error("Club name and code are required");
    }

    // Check if club already exists
    const existingClub = await Club.findOne({
      code: code.toUpperCase(),
      branch: branch || null,
    });

    if (existingClub) {
      res.status(400);
      throw new Error("Club with this code already exists in this branch");
    }

    const club = await Club.create({
      name,
      code: code.toUpperCase(),
      description,
      logo,
      branch: branch || null,
      category: category || "other",
      socialLinks,
      createdBy: req.user._id,
    });

    const populatedClub = await Club.findById(club._id).populate(
      "branch",
      "name code"
    );

    res.status(201).json(populatedClub);
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    throw new Error(error.message);
  }
};

// @desc    Update a club
// @route   PUT /api/superadmin/clubs/:id
// @access  Super Admin
const updateClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);

    if (!club) {
      res.status(404);
      throw new Error("Club not found");
    }

    const updatedClub = await Club.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate("branch", "name code");

    res.status(200).json(updatedClub);
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    throw new Error(error.message);
  }
};

// @desc    Delete a club
// @route   DELETE /api/superadmin/clubs/:id
// @access  Super Admin
const deleteClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);

    if (!club) {
      res.status(404);
      throw new Error("Club not found");
    }

    await Club.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ message: "Club deleted successfully", id: req.params.id });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    throw new Error(error.message);
  }
};

// ==================== ADMIN MANAGEMENT ====================

// @desc    Get all admins
// @route   GET /api/superadmin/admins
// @access  Super Admin
const getAllAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" })
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();

    // Manually populate to avoid refPath issues with "none" type
    const populatedAdmins = await Promise.all(
      admins.map(async (admin) => {
        if (
          admin.organizationType &&
          admin.organizationType !== "none" &&
          admin.organizationId
        ) {
          if (admin.organizationType === "Branch") {
            const branch = await Branch.findById(admin.organizationId).select(
              "name code"
            );
            admin.organizationId = branch;
          } else if (admin.organizationType === "Club") {
            const club = await Club.findById(admin.organizationId).select(
              "name code"
            );
            admin.organizationId = club;
          }
        }
        return admin;
      })
    );

    res.status(200).json(populatedAdmins);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
};

// @desc    Create a new admin
// @route   POST /api/superadmin/admins
// @access  Super Admin
const createAdmin = async (req, res) => {
  try {
    const { name, email, phone, password, organizationType, organizationId } =
      req.body;

    if (!name || !email || !phone || !password) {
      res.status(400);
      throw new Error("Please provide all required fields");
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase().trim() }, { phone }],
    });

    if (existingUser) {
      res.status(400);
      throw new Error("User with this email or phone already exists");
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = await User.create({
      name,
      email: email.toLowerCase().trim(),
      phone,
      password: hashedPassword,
      role: "admin",
      isAdmin: true,
      isEmailVerified: true, // Admins created by super admin are auto-verified
      organizationType: organizationType || "none",
      organizationId: organizationId || null,
      createdBy: req.user._id,
    });

    let query = User.findById(admin._id).select("-password");
    if (organizationType && organizationType !== "none") {
      query = query.populate("organizationId");
    }
    const populatedAdmin = await query;

    res.status(201).json(populatedAdmin);
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    throw new Error(error.message);
  }
};

// @desc    Update an admin
// @route   PUT /api/superadmin/admins/:id
// @access  Super Admin
const updateAdmin = async (req, res) => {
  try {
    const admin = await User.findById(req.params.id);

    if (!admin) {
      res.status(404);
      throw new Error("Admin not found");
    }

    if (admin.role === "superadmin") {
      res.status(403);
      throw new Error("Cannot modify Super Admin");
    }

    // Don't allow password update through this route
    const { password, ...updateData } = req.body;

    const updatedAdmin = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select("-password");

    res.status(200).json(updatedAdmin);
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    throw new Error(error.message);
  }
};

// @desc    Delete an admin
// @route   DELETE /api/superadmin/admins/:id
// @access  Super Admin
const deleteAdmin = async (req, res) => {
  try {
    const admin = await User.findById(req.params.id);

    if (!admin) {
      res.status(404);
      throw new Error("Admin not found");
    }

    if (admin.role === "superadmin") {
      res.status(403);
      throw new Error("Cannot delete Super Admin");
    }

    await User.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ message: "Admin deleted successfully", id: req.params.id });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    throw new Error(error.message);
  }
};

// @desc    Deactivate an admin
// @route   PUT /api/superadmin/admins/:id/deactivate
// @access  Super Admin
const deactivateAdmin = async (req, res) => {
  try {
    const admin = await User.findById(req.params.id);

    if (!admin) {
      res.status(404);
      throw new Error("Admin not found");
    }

    if (admin.role === "superadmin") {
      res.status(403);
      throw new Error("Cannot deactivate Super Admin");
    }

    admin.isActive = false;
    admin.bannedReason = req.body.reason || "Deactivated by Super Admin";
    admin.bannedAt = new Date();
    admin.bannedBy = req.user._id;
    await admin.save();

    res
      .status(200)
      .json({ message: "Admin deactivated successfully", id: req.params.id });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    throw new Error(error.message);
  }
};

// @desc    Reactivate an admin
// @route   PUT /api/superadmin/admins/:id/reactivate
// @access  Super Admin
const reactivateAdmin = async (req, res) => {
  try {
    const admin = await User.findById(req.params.id);

    if (!admin) {
      res.status(404);
      throw new Error("Admin not found");
    }

    admin.isActive = true;
    admin.bannedReason = "";
    admin.bannedAt = null;
    admin.bannedBy = null;
    await admin.save();

    res
      .status(200)
      .json({ message: "Admin reactivated successfully", id: req.params.id });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    throw new Error(error.message);
  }
};

// ==================== USER MANAGEMENT ====================

// @desc    Get all users (students)
// @route   GET /api/superadmin/users
// @access  Super Admin
const getAllUsers = async (req, res) => {
  try {
    const { branch, role, isActive } = req.query;
    const query = {};

    if (branch) query.branch = branch;
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === "true";

    const users = await User.find(query)
      .select("-password")
      .populate("branch", "name code")
      .sort({ createdAt: -1 });

    res.status(200).json(users);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
};

// @desc    Ban a user
// @route   PUT /api/superadmin/users/:id/ban
// @access  Super Admin
const banUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    if (user.role === "superadmin") {
      res.status(403);
      throw new Error("Cannot ban Super Admin");
    }

    user.isActive = false;
    user.bannedReason = req.body.reason || "Banned by Super Admin";
    user.bannedAt = new Date();
    user.bannedBy = req.user._id;
    await user.save();

    res
      .status(200)
      .json({ message: "User banned successfully", id: req.params.id });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    throw new Error(error.message);
  }
};

// @desc    Unban a user
// @route   PUT /api/superadmin/users/:id/unban
// @access  Super Admin
const unbanUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    user.isActive = true;
    user.bannedReason = "";
    user.bannedAt = null;
    user.bannedBy = null;
    await user.save();

    res
      .status(200)
      .json({ message: "User unbanned successfully", id: req.params.id });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    throw new Error(error.message);
  }
};

// ==================== STATISTICS ====================

// @desc    Get system statistics
// @route   GET /api/superadmin/stats
// @access  Super Admin
const getSystemStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalStudents,
      totalAdmins,
      totalBranches,
      totalClubs,
      totalListings,
      activeListings,
      totalEvents,
      upcomingEvents,
      bannedUsers,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "student" }),
      User.countDocuments({ role: "admin" }),
      Branch.countDocuments(),
      Club.countDocuments(),
      Listing.countDocuments(),
      Listing.countDocuments({ status: "active" }),
      Event.countDocuments(),
      Event.countDocuments({ eventDate: { $gte: new Date() } }),
      User.countDocuments({ isActive: false }),
    ]);

    res.status(200).json({
      users: {
        total: totalUsers,
        students: totalStudents,
        admins: totalAdmins,
        banned: bannedUsers,
      },
      branches: totalBranches,
      clubs: totalClubs,
      listings: {
        total: totalListings,
        active: activeListings,
      },
      events: {
        total: totalEvents,
        upcoming: upcomingEvents,
      },
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
};

module.exports = {
  // Branches
  getAllBranches,
  createBranch,
  updateBranch,
  deleteBranch,
  // Clubs
  getAllClubs,
  createClub,
  updateClub,
  deleteClub,
  // Admins
  getAllAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  deactivateAdmin,
  reactivateAdmin,
  // Users
  getAllUsers,
  banUser,
  unbanUser,
  // Stats
  getSystemStats,
};
