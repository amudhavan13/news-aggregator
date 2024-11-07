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
  createdAt: { type: Date, default: Date.now },
});
const User = mongoose.model("User", userSchema);

// Signup route
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  console.log("Signup request received with email:", email); // Log the received email

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists with this email:", email);
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed successfully");

    // Create a new user
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();
    console.log("New user registered successfully:", newUser);

    res.status(201).json({ success: true, message: "Registration successful" });
  } catch (error) {
    console.error("Error registering user:", error.message);
    res.status(500).json({ success: false, message: "Error registering user", error: error.message });
  }
});

// Login route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("Login request received with email:", email);

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found with email:", email);
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // Compare password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password mismatch for user with email:", email);
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    console.log("User logged in successfully:", email);
    res.status(200).json({ success: true, message: "Login successful" });
  } catch (error) {
    console.error("Error logging in:", error.message);
    res.status(500).json({ success: false, message: "Error logging in", error: error.message });
  }
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
