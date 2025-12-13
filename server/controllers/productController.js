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

    query.status = "active"; // Only show active listings

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
    images,
    location,
    tags,
    itemImage, // Legacy support
  } = req.body;

  if (!title || !description || !price) {
    res.status(400);
    throw new Error("Please fill all required details!");
  }

  // Handle legacy itemImage if images array not provided
  let finalImages = images || [];
  if (itemImage && finalImages.length === 0) {
    finalImages = [{ url: itemImage, isPrimary: true }];
  }

  const newListing = await Listing.create({
    title,
    description,
    price,
    category: category || "other",
    condition: condition || "good",
    images: finalImages,
    location: location || { campus: "Main" },
    tags: tags || [],
    user: req.user._id,
    status: "active",
  });

  if (!newListing) {
    res.status(400);
    throw new Error("Listing not created");
  }

  const populatedListing = await Listing.findById(newListing._id).populate(
    "user",
    "name email profile reputation"
  );

  res.status(201).json(populatedListing);
};

const getProduct = async (req, res) => {
  const listing = await Listing.findById(req.params.id).populate(
    "user",
    "name email profile reputation verificationStatus createdAt"
  );

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

  const updatedListing = await Listing.findByIdAndUpdate(
    req.params.id,
    req.body,
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

module.exports = {
  getProducts,
  addProduct,
  getProduct,
  updateProduct,
  deleteProduct,
};
