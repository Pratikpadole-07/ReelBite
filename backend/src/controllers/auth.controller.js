const userModel = require("../models/user.model");
const foodPartnerModel = require("../models/foodpartner.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const storageService = require("../services/storage.service");
const { v4: uuid } = require("uuid");

/* ================= COOKIE OPTIONS ================= */
const cookieOptions = {
  httpOnly: true,
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  secure: process.env.NODE_ENV === "production",
};

/* ================= USER AUTH ================= */

async function registerUser(req, res) {
  try {
    const { fullName, email, password } = req.body;

    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      fullName,
      email,
      password: hashed,
    });

    const token = jwt.sign(
      { id: user._id, role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, cookieOptions);

    const safeUser = user.toObject();
    delete safeUser.password;

    res.status(201).json({ user: safeUser });
  } catch (err) {
    res.status(500).json({ message: "Registration failed" });
  }
}

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, cookieOptions);

    const safeUser = user.toObject();
    delete safeUser.password;

    res.json({ user: safeUser });
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
}

function logoutUser(req, res) {
  res.clearCookie("token", cookieOptions);
  res.json({ message: "Logged out" });
}

/* ================= FOOD PARTNER AUTH ================= */

async function registerFoodPartner(req, res) {
  try {
    const exists = await foodPartnerModel.findOne({ email: req.body.email });
    if (exists) {
      return res.status(400).json({ message: "Partner already exists" });
    }

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

    const safePartner = partner.toObject();
    delete safePartner.password;

    res.status(201).json({ foodPartner: safePartner });
  } catch (err) {
    res.status(500).json({ message: "Partner registration failed" });
  }
}

async function loginFoodPartner(req, res) {
  try {
    const { email, password } = req.body;

    const partner = await foodPartnerModel.findOne({ email });
    if (!partner) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, partner.password);
    if (!ok) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: partner._id, role: "partner" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, cookieOptions);

    const safePartner = partner.toObject();
    delete safePartner.password;

    res.json({ foodPartner: safePartner });
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
}

function logoutFoodPartner(req, res) {
  res.clearCookie("token", cookieOptions);
  res.json({ message: "Logged out" });
}

/* ================= PROFILE UPDATES ================= */

async function updateUserAvatar(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const uploadResult = await storageService.uploadFile(
      req.file.buffer,
      `avatar-${req.user._id}`
    );

    const user = await userModel
      .findByIdAndUpdate(
        req.user._id,
        { avatar: uploadResult.url },
        { new: true }
      )
      .select("-password");

    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Avatar update failed" });
  }
}

async function updateFoodPartnerProfile(req, res) {
  try {
    const updates = { ...req.body };

    if (req.file) {
      const uploadResult = await storageService.uploadFile(
        req.file.buffer,
        `logo-${uuid()}`
      );
      updates.logo = uploadResult.url;
    }

    const partner = await foodPartnerModel
      .findByIdAndUpdate(req.user._id, updates, { new: true })
      .select("-password");

    res.json({ foodPartner: partner });
  } catch (err) {
    res.status(500).json({ message: "Profile update failed" });
  }
}

/* ================= EXPORTS ================= */

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  registerFoodPartner,
  loginFoodPartner,
  logoutFoodPartner,
  updateUserAvatar,
  updateFoodPartnerProfile,
};
