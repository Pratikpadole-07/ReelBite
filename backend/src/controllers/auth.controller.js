const userModel = require("../models/user.model");
const foodPartnerModel = require("../models/foodpartner.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const storageService = require("../services/storage.service");
const { v4: uuid } = require("uuid");

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: false,
};

// ---------------- USER ----------------

async function registerUser(req, res) {
  const { fullName, email, password } = req.body;

  const exists = await userModel.findOne({ email });
  if (exists) return res.status(400).json({ message: "User already exists" });

  const hashed = await bcrypt.hash(password, 10);
  const user = await userModel.create({ fullName, email, password: hashed });

  const token = jwt.sign(
    { id: user._id, role: "user" },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("token", token, cookieOptions);
  res.status(201).json({ user });
}

async function loginUser(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: user._id, role: "user" },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("token", token, cookieOptions);
  res.json({ user });
}

function logoutUser(req, res) {
  res.clearCookie("token", cookieOptions);
  res.json({ message: "Logged out" });
}

// ---------------- FOOD PARTNER ----------------

async function registerFoodPartner(req, res) {
  const exists = await foodPartnerModel.findOne({ email: req.body.email });
  if (exists)
    return res.status(400).json({ message: "Partner already exists" });

  const hashed = await bcrypt.hash(req.body.password, 10);

  const partner = await foodPartnerModel.create({
    ...req.body,
    password: hashed,
  });

  const token = jwt.sign(
    { id: partner._id, role: "partner" },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("token", token, cookieOptions);
  res.status(201).json({ foodPartner: partner });
}

async function loginFoodPartner(req, res) {
  const { email, password } = req.body;

  const partner = await foodPartnerModel.findOne({ email });
  if (!partner) return res.status(400).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, partner.password);
  if (!ok) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: partner._id, role: "partner" },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("token", token, cookieOptions);
  res.json({ foodPartner: partner });
}

function logoutFoodPartner(req, res) {
  res.clearCookie("token", cookieOptions);
  res.json({ message: "Logged out" });
}

async function updateUserAvatar(req, res) {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const uploadResult = await storageService.uploadFile(
    req.file.buffer,
    "avatar-" + req.user._id
  );

  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    { avatar: uploadResult.url },
    { new: true }
  ).select("-password");

  res.json({ user });
}

async function updateFoodPartnerProfile(req, res) {
  const updates = req.body;

  if (req.file) {
    const uploadResult = await storageService.uploadFile(
      req.file.buffer,
      "logo-" + uuid()
    );
    updates.logo = uploadResult.url;
  }

  const partner = await foodPartnerModel.findByIdAndUpdate(
    req.user._id,
    updates,
    { new: true }
  ).select("-password");

  res.json({ foodPartner: partner });
}


module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  registerFoodPartner,
  loginFoodPartner,
  logoutFoodPartner,
  updateUserAvatar,
  updateFoodPartnerProfile
};
