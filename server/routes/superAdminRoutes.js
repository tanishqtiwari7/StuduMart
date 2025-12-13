const express = require("express");
const { superAdminProtect } = require("../middleware/superAdminMiddleware");
const {
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
  deactivateAdmin,
  reactivateAdmin,
  // Users
  getAllUsers,
  banUser,
  unbanUser,
  // Stats
  getSystemStats,
} = require("../controllers/superAdminController");

const router = express.Router();

// All routes are protected by superAdminProtect middleware

// ==================== BRANCHES ====================
router.get("/branches", superAdminProtect, getAllBranches);
router.post("/branches", superAdminProtect, createBranch);
router.put("/branches/:id", superAdminProtect, updateBranch);
router.delete("/branches/:id", superAdminProtect, deleteBranch);

// ==================== CLUBS ====================
router.get("/clubs", superAdminProtect, getAllClubs);
router.post("/clubs", superAdminProtect, createClub);
router.put("/clubs/:id", superAdminProtect, updateClub);
router.delete("/clubs/:id", superAdminProtect, deleteClub);

// ==================== ADMINS ====================
router.get("/admins", superAdminProtect, getAllAdmins);
router.post("/admins", superAdminProtect, createAdmin);
router.put("/admins/:id", superAdminProtect, updateAdmin);
router.put("/admins/:id/deactivate", superAdminProtect, deactivateAdmin);
router.put("/admins/:id/reactivate", superAdminProtect, reactivateAdmin);

// ==================== USERS ====================
router.get("/users", superAdminProtect, getAllUsers);
router.put("/users/:id/ban", superAdminProtect, banUser);
router.put("/users/:id/unban", superAdminProtect, unbanUser);

// ==================== STATISTICS ====================
router.get("/stats", superAdminProtect, getSystemStats);

module.exports = router;
