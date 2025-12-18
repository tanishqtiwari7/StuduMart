const Listing = require("../models/listingModel");

const getProducts = async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      condition,
      location,
      sort,
      search,
      page = 1,
      limit = 10,
      user,
    } = req.query;

    const query = {};

    // Search
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    // Filters
    if (category) query.category = category;
    if (condition) query.condition = condition;
    if (location) query["location.campus"] = location;
    if (user) query.user = user;

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Status Filter
    // If status is explicitly provided, use it (e.g. "pending", "sold")
    // If filtering by user (My Profile), show all statuses if not specified
    // Otherwise (General Feed), default to "approved"
    if (req.query.status) {
      query.status = req.query.status;
    } else if (!user) {
      query.status = "approved";
    }

    // Sorting
    let sortOption = { createdAt: -1 }; // Default: newest first
    if (sort === "price_asc") sortOption = { price: 1 };
    if (sort === "price_desc") sortOption = { price: -1 };
    if (sort === "popular") sortOption = { views: -1 };
    if (sort === "oldest") sortOption = { createdAt: 1 };

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    const listings = await Listing.find(query)
      .populate("user", "name email profile reputation verificationStatus")
      .populate("category", "name")
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    const total = await Listing.countDocuments(query);

    res.status(200).json({
      listings,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      total,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
};

const addProduct = async (req, res) => {
  let {
    title,
    description,
    price,
    category,
    condition,
    location,
    tags,
    itemImage, // Legacy support
  } = req.body;

  if (!title || !description || !price || !category) {
    res.status(400);
    throw new Error("Please fill all required details!");
  }

  let finalImages = [];

  // Handle uploaded files (Base64 Storage)
  if (req.files && req.files.length > 0) {
    finalImages = req.files.map((file, index) => {
      const b64 = Buffer.from(file.buffer).toString("base64");
      const dataURI = "data:" + file.mimetype + ";base64," + b64;
      return {
        url: dataURI,
        caption: file.originalname,
        isPrimary: index === 0,
      };
    });
  } else if (req.body.images) {
    try {
      finalImages =
        typeof req.body.images === "string"
          ? JSON.parse(req.body.images)
          : req.body.images;
    } catch (e) {
      finalImages = [];
    }
  } else if (itemImage) {
    finalImages = [{ url: itemImage, isPrimary: true }];
  }

  // Parse location and tags if they are strings (multipart/form-data)
  let parsedLocation = location;
  if (typeof location === "string") {
    try {
      parsedLocation = JSON.parse(location);
    } catch (e) {
      parsedLocation = { campus: "Main" };
    }
  }

  let parsedTags = tags;
  if (typeof tags === "string") {
    try {
      parsedTags = JSON.parse(tags);
    } catch (e) {
      parsedTags = [];
    }
  }

  const newListing = await Listing.create({
    title,
    description,
    price,
    category,
    condition: condition || "good",
    images: finalImages,
    location: parsedLocation || { campus: "Main" },
    tags: parsedTags || [],
    user: req.user._id,
    status: "pending", // Explicitly set to pending
  });

  if (!newListing) {
    res.status(400);
    throw new Error("Listing not created");
  }

  const populatedListing = await Listing.findById(newListing._id)
    .populate("user", "name email profile reputation")
    .populate("category", "name");

  res.status(201).json(populatedListing);
};

const getProduct = async (req, res) => {
  const listing = await Listing.findById(req.params.id)
    .populate(
      "user",
      "name email profile reputation verificationStatus createdAt"
    )
    .populate("category", "name");

  if (!listing) {
    res.status(404);
    throw new Error("Product Not Found!");
  }

  // Increment views
  listing.views += 1;
  await listing.save({ validateBeforeSave: false });

  res.status(200).json(listing);
};

const updateProduct = async (req, res) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    res.status(404);
    throw new Error("Product Not Found!");
  }

  if (!req.user) {
    res.status(401);
    throw new Error("User not found");
  }

  if (listing.user.toString() !== req.user.id && req.user.role !== "admin") {
    res.status(401);
    throw new Error("User not authorized");
  }

  let updatedData = { ...req.body };

  // Handle file uploads (Base64 Storage)
  if (req.files && req.files.length > 0) {
    const newImages = req.files.map((file, index) => {
      const b64 = Buffer.from(file.buffer).toString("base64");
      const dataURI = "data:" + file.mimetype + ";base64," + b64;
      return {
        url: dataURI,
        caption: file.originalname,
        isPrimary: false,
      };
    });

    const currentImages = listing.images || [];
    updatedData.images = [...currentImages, ...newImages];
  }

  // Parse JSON fields if string
  if (typeof updatedData.location === "string") {
    try {
      updatedData.location = JSON.parse(updatedData.location);
    } catch (e) {}
  }
  if (typeof updatedData.tags === "string") {
    try {
      updatedData.tags = JSON.parse(updatedData.tags);
    } catch (e) {}
  }

  const updatedListing = await Listing.findByIdAndUpdate(
    req.params.id,
    updatedData,
    { new: true }
  ).populate("user", "name email profile");

  res.status(200).json(updatedListing);
};

const deleteProduct = async (req, res) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    res.status(404);
    throw new Error("Product Not Found!");
  }

  if (!req.user) {
    res.status(401);
    throw new Error("User not found");
  }

  if (listing.user.toString() !== req.user.id && req.user.role !== "admin") {
    res.status(401);
    throw new Error("User not authorized");
  }

  await Listing.findByIdAndDelete(req.params.id);

  res.status(200).json({ id: req.params.id });
};

// Admin: Approve Product
const approveProduct = async (req, res) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    res.status(404);
    throw new Error("Product not found");
  }

  listing.status = "approved";
  await listing.save();

  res.status(200).json(listing);
};

// Admin: Reject Product
const rejectProduct = async (req, res) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    res.status(404);
    throw new Error("Product not found");
  }

  listing.status = "rejected";
  await listing.save();

  res.status(200).json(listing);
};

// Student: Mark as Sold
const markSold = async (req, res) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (listing.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("Not authorized");
  }

  listing.status = "sold";
  await listing.save();

  res.status(200).json(listing);
};

module.exports = {
  getProducts,
  addProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  approveProduct,
  rejectProduct,
  markSold,
};
