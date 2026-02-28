const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const foodRoutes = require("./routes/foodroutes");
const orderRoutes = require("./routes/orderroutes");

const app = express();

// Enable CORS for all origins
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => res.send("Backend running 🚀"));

// Test endpoint for frontend connectivity
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is running and connected!", status: "ok" });
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  const mongoStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  res.json({ 
    status: "ok", 
    mongodb: mongoStatus,
    timestamp: new Date().toISOString()
  });
});

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/govindhacanteen")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
