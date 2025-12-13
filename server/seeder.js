const mongoose = require("mongoose");
const dotenv = require("dotenv");
const colors = require("colors");
const bcrypt = require("bcryptjs");
const User = require("./models/userModel");
const Branch = require("./models/branchModel");
const Club = require("./models/clubModel");
const Listing = require("./models/listingModel");
const Event = require("./models/eventModel");
const connectDB = require("./config/dbConfig");

dotenv.config();

connectDB();

// Default B.Tech Branches
const defaultBranches = [
  { name: "Computer Science Engineering", code: "CSE", department: "Engineering", degree: "B.Tech" },
  { name: "Electronics & Communication Engineering", code: "ECE", department: "Engineering", degree: "B.Tech" },
  { name: "Mechanical Engineering", code: "ME", department: "Engineering", degree: "B.Tech" },
  { name: "Civil Engineering", code: "CE", department: "Engineering", degree: "B.Tech" },
  { name: "Electrical Engineering", code: "EE", department: "Engineering", degree: "B.Tech" },
  { name: "Information Technology", code: "IT", department: "Engineering", degree: "B.Tech" },
  { name: "Artificial Intelligence & Data Science", code: "AIDS", department: "Engineering", degree: "B.Tech" },
];

// Super Admin Configuration
const SUPER_ADMIN = {
  name: "Super Admin",
  email: process.env.SUPER_ADMIN_EMAIL || "tanishqtiwari2020@gmail.com",
  phone: "0000000000",
  password: process.env.SUPER_ADMIN_PASSWORD || "superadmin123",
  role: "superadmin",
  isAdmin: true,
  isEmailVerified: true,
  university: "StuduMart System",
};

const initializeSuperAdmin = async () => {
  try {
    // Check if super admin already exists
    const existingSuperAdmin = await User.findOne({ role: "superadmin" });
    
    if (existingSuperAdmin) {
      console.log("✅ Super Admin already exists:".green, existingSuperAdmin.email);
      return existingSuperAdmin;
    }

    // Create Super Admin
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(SUPER_ADMIN.password, salt);

    const superAdmin = await User.create({
      ...SUPER_ADMIN,
      password: hashedPassword,
    });

    console.log("🔐 Super Admin Created:".green.bold);
    console.log("   Email:".cyan, SUPER_ADMIN.email);
    console.log("   Password:".cyan, SUPER_ADMIN.password);
    console.log("   ⚠️  Please change the password after first login!".yellow);
    
    return superAdmin;
  } catch (error) {
    console.error("Error creating Super Admin:".red, error.message);
    throw error;
  }
};

const initializeBranches = async (superAdminId) => {
  try {
    const existingBranches = await Branch.countDocuments();
    
    if (existingBranches > 0) {
      console.log(`✅ ${existingBranches} Branches already exist`.green);
      return;
    }

    const branchesWithCreator = defaultBranches.map(branch => ({
      ...branch,
      createdBy: superAdminId,
    }));

    await Branch.insertMany(branchesWithCreator);
    console.log(`🏛️  Created ${defaultBranches.length} default branches`.green.bold);
    
    defaultBranches.forEach(b => {
      console.log(`   - ${b.code}: ${b.name}`.cyan);
    });
  } catch (error) {
    console.error("Error creating branches:".red, error.message);
    throw error;
  }
};

const importData = async () => {
  try {
    console.log("\n🚀 StuduMart Database Initialization\n".blue.bold);
    
    // Step 1: Create Super Admin
    const superAdmin = await initializeSuperAdmin();
    
    // Step 2: Create Default Branches
    await initializeBranches(superAdmin._id);
    
    console.log("\n✨ Initialization Complete!".green.bold);
    console.log("   You can now login as Super Admin and create clubs.\n");
    
    process.exit();
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`.red.bold);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    console.log("\n🗑️  Destroying all data...".red.bold);
    
    await User.deleteMany();
    await Branch.deleteMany();
    await Club.deleteMany();
    await Listing.deleteMany();
    await Event.deleteMany();

    console.log("✅ All data destroyed!".red.bold);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

// Command line handling
if (process.argv[2] === "-d") {
  destroyData();
} else if (process.argv[2] === "-init") {
  importData();
} else {
  console.log("\nUsage:".yellow);
  console.log("  node seeder.js -init".cyan, "  Initialize Super Admin & Branches");
  console.log("  node seeder.js -d".cyan, "     Destroy all data\n");
  process.exit();
}
