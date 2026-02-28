const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Signup
exports.signup = async (req, res) => {
  try {
    const { username, email, password, phone, adminSecret } = req.body;
    
    // Log incoming request data (without password)
    console.log("Signup request received:", { username, email, phone });

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists:", email);
      return res.status(400).json({ message: "User already exists" });
    }

    // Determine user role based on admin secret key
    let role = "user";
    const secretKey = "admin123"; // Secret key for admin registration
    
    if (adminSecret && adminSecret === secretKey) {
      role = "admin";
      console.log("Admin registration detected for:", email);
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, phone: phone || "", password: hashedPassword, role });
    await newUser.save();

    console.log("User created successfully:", email, "with role:", role);
    res.status(201).json({ 
      message: role === "admin" ? "Admin account created successfully" : "Signup successful",
      user: { id: newUser._id, username: newUser.username, email: newUser.email, role: newUser.role }
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secretkey", { expiresIn: "1h" });

    res.status(200).json({
      message: "Login successful",
      token,
      user: { 
        id: user._id,
        username: user.username, 
        email: user.email,
        phone: user.phone || "",
        role: user.role 
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Profile
exports.profile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const { username, phone } = req.body;
    const userId = req.userId;
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    
    // Update fields
    if (username) user.username = username;
    if (phone) user.phone = phone;
    
    await user.save();
    
    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
