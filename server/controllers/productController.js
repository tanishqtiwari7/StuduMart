const Listing = require("../models/listingModel");
const mongoose = require("mongoose");

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
      if (req.query.status === "all") {
        // Do not filter by status (show all)
      } else {
        query.status = req.query.status;
      }
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
  try {
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
    if (listing.views === undefined || listing.views === null) {
      listing.views = 0;
    }
    listing.views += 1;

    try {
      await listing.save({ validateBeforeSave: false });
    } catch (saveError) {
      console.error(
        `Failed to update views for product ${req.params.id}:`,
        saveError.message
      );
      // Continue even if view increment fails
    }

    res.status(200).json(listing);
  } catch (error) {
    console.error(`Error fetching product ${req.params.id}:`, error);
    res.status(500);
    throw new Error(error.message);
  }
};

const updateProduct = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(400);
      throw new Error("Invalid Product ID");
    }

    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      res.status(404);
      throw new Error("Product Not Found!");
    }

    if (!req.user) {
      res.status(401);
      throw new Error("User not found");
    }

    // Ensure listing.user exists before checking
    if (!listing.user) {
      // If user is missing on listing, only admin can edit or it's a data integrity issue
      if (req.user.role !== "admin") {
        res.status(401);
        throw new Error("User not authorized (Listing has no owner)");
      }
    } else if (
      listing.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      res.status(401);
      throw new Error("User not authorized");
    }

    let updatedData = { ...req.body };

    // Prevent updating immutable fields
    delete updatedData._id;
    delete updatedData.user;
    delete updatedData.createdAt;
    delete updatedData.updatedAt;

    // Reset status to pending for non-admins
    if (req.user.role !== "admin") {
      updatedData.status = "pending";
    }

    // Handle Images
    let keptImages = [];

    // 1. Get kept images from req.body.images (if provided)
    // If req.body.images is sent, it means the user is updating the image list.
    // If it's NOT sent, we assume they want to keep existing images as is (unless files are added, which is handled below).
    // However, to support deletion, the frontend MUST send the list of images to keep.
    if (updatedData.images) {
      try {
        keptImages =
          typeof updatedData.images === "string"
            ? JSON.parse(updatedData.images)
            : updatedData.images;

        // Ensure it's an array
        if (!Array.isArray(keptImages)) keptImages = [];
      } catch (e) {
        keptImages = [];
      }
    } else {
      // If not provided in body, default to current images (so we don't accidentally delete them if only changing title)
      // BUT, if the user explicitly sends an empty array string "[]", it will be caught above.
      // If the field is missing entirely, we keep existing.
      keptImages = listing.images || [];
    }

    // 2. Handle new file uploads
    let newImages = [];
    if (req.files && req.files.length > 0) {
      newImages = req.files.map((file, index) => {
        const b64 = Buffer.from(file.buffer).toString("base64");
        const dataURI = "data:" + file.mimetype + ";base64," + b64;
        return {
          url: dataURI,
          caption: file.originalname,
          isPrimary: false, // We'll set primary later
        };
      });
    }

    // 3. Combine
    updatedData.images = [...keptImages, ...newImages];

    // 4. Ensure at least one image is primary
    if (updatedData.images.length > 0) {
      const hasPrimary = updatedData.images.some((img) => img.isPrimary);
      if (!hasPrimary) {
        updatedData.images[0].isPrimary = true;
      }
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

    // Sanitize data: Remove empty strings, "undefined" strings, or null values
    Object.keys(updatedData).forEach((key) => {
      if (
        updatedData[key] === "" ||
        updatedData[key] === "undefined" ||
        updatedData[key] === "null" ||
        updatedData[key] === null ||
        updatedData[key] === undefined
      ) {
        delete updatedData[key];
      }
    });

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true, runValidators: true }
    ).populate("user", "name email profile");

    res.status(200).json(updatedListing);
  } catch (error) {
    console.error(`Error updating product ${req.params.id}:`, error);
    if (error.name === "ValidationError" || error.name === "CastError") {
      res.status(400);
    } else if (res.statusCode === 200) {
      res.status(500);
    }
    throw new Error(error.message);
  }
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
