// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/newsApp")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// User schema and model
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  interests: { type: [String], default: [] }, // Array to store user interests
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

// Signup route
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ success: true, message: "Registration successful" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error registering user" });
  }
});

// Login route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
    res.status(200).json({ success: true, message: "Login successful" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error logging in" });
  }
});

// Get interests for user
app.get("/user/interests", async (req, res) => {
  const { email } = req.query;
  try {
    const user = await User.findOne({ email });
    res.json({ success: true, interests: user.interests });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching interests" });
  }
});

// Add interest for user
app.post("/user/interests", async (req, res) => {
  const { email, interests } = req.body;
  try {
    await User.updateOne({ email }, { interests });
    res.json({ success: true, message: "Interests updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating interests" });
  }
});

// Remove interest for user
app.post("/user/remove-interest", async (req, res) => {
  const { email, interest } = req.body;
  try {
    await User.updateOne({ email }, { $pull: { interests: interest } });
    res.json({ success: true, message: "Interest removed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error removing interest" });
  }
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
