const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { User } = require("../models");
const generateToken = require("../utils/generateToken");

// @desc  Register new user (student/admin/warden)
// @route POST /api/auth/register
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, hostel, department, roomNumber, phone } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Name, email and password are required");
  }

  const existing = await User.findOne({ where: { email } });
  if (existing) {
    res.status(400);
    throw new Error("A user with this email already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: role && ["student", "admin", "warden"].includes(role) ? role : "student",
    hostel,
    department,
    roomNumber,
    phone,
  });

  const token = generateToken(user);

  res.status(201).json({
    success: true,
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      hostel: user.hostel,
      department: user.department,
    },
  });
});

// @desc  Login
// @route POST /api/auth/login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const user = await User.findOne({ where: { email } });
  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const token = generateToken(user);

  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      hostel: user.hostel,
      department: user.department,
    },
  });
});

// @desc  Get logged-in user's profile
// @route GET /api/auth/profile
const getProfile = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});

// @desc  Update profile
// @route PUT /api/auth/profile
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const { name, hostel, department, roomNumber, phone, password } = req.body;
  if (name) user.name = name;
  if (hostel) user.hostel = hostel;
  if (department) user.department = department;
  if (roomNumber) user.roomNumber = roomNumber;
  if (phone) user.phone = phone;
  if (password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
  }

  await user.save();
  res.json({ success: true, message: "Profile updated successfully" });
});

// @desc  Forgot password (demo: returns a reset token; wire up email service in production)
// @route POST /api/auth/forgot-password
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) {
    res.status(404);
    throw new Error("No account found with this email");
  }
  const resetToken = generateToken(user);
  // In production: email this link instead of returning it directly.
  res.json({
    success: true,
    message: "Password reset token generated. In production this would be emailed to the user.",
    resetToken,
  });
});

// @desc  Reset password using token
// @route POST /api/auth/reset-password
const resetPassword = asyncHandler(async (req, res) => {
  const jwt = require("jsonwebtoken");
  const { token, newPassword } = req.body;

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findByPk(decoded.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  await user.save();

  res.json({ success: true, message: "Password reset successfully" });
});

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  forgotPassword,
  resetPassword,
};
