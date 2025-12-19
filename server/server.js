const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();
const path = require("path");
const colors = require("colors");
const connectDB = require("./config/dbConfig");
const errorHandler = require("./middleware/errorHandler");

const PORT = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_chat", (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

// DB Connection
connectDB();

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve Uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Default Route
if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "/client/dist")));

  app.get("/", (req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running... (development mode)");
  });
}

// Auth Routes
app.use("/api/auth", require("./routes/authRoutes"));

// Listing Routes
app.use("/api/product", require("./routes/productRoutes"));

// Messages Routes
app.use("/api/message", require("./routes/messageRoutes"));

// Event Routes
app.use("/api/event", require("./routes/eventRoutes"));

// Admin Routes
app.use("/api/admin", require("./routes/adminRoutes"));

// Super Admin Routes
app.use("/api/superadmin", require("./routes/superAdminRoutes"));

// Payment Routes
app.use("/api/payments", require("./routes/paymentRoutes"));

// Category Routes
app.use("/api/categories", require("./routes/categoryRoutes"));

// Upload Routes
app.use("/api/upload", require("./routes/uploadRoutes"));

// Error Handler
app.use(errorHandler);

server.listen(PORT, () => {
  console.log(`SERVER IS RUNNIG AT PORT : ${PORT}`.bgBlue.black);
});
