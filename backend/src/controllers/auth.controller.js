const userModel = require("../models/user.model");
const foodPartnerModel = require("../models/foodpartner.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const storageService = require("../services/storage.service");
const { v4: uuid } = require("uuid");
const logEvent = require("../utils/auditLogger");

/* ================= SAFE LOGGER ================= */
function safeLog(payload) {
  try {
    logEvent(payload);
  } catch (err) {
    console.error("Audit log failed:", err.message);
  }
}

/* ================= COOKIE OPTIONS ================= */
const cookieOptions = {
  httpOnly: true,
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  secure: process.env.NODE_ENV === "production",
};

/* ================= USER AUTH ================= */

async function registerUser(req, res) {
  try {
    const fullName = req.body.fullName;
    const email = req.body.email.toLowerCase();
    const password = req.body.password;

    const exists = await userModel.findOne({ email });
    if (exists) {
      safeLog({
        actorId: null,
        actorRole: "system",
        action: "USER_REGISTER_FAILED",
        metadata: { email },
        req,
      });
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await userModel.create({ fullName, email, password: hashed });

    const token = jwt.sign(
      { id: user._id, role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, cookieOptions);

    safeLog({
      actorId: user._id,
      actorRole: "user",
      action: "USER_REGISTER_SUCCESS",
      req,
    });

    const safeUser = user.toObject();
    delete safeUser.password;

    res.status(201).json({ user: safeUser });
  } catch (err) {
    console.error("Register error:", err.message);
    res.status(500).json({ message: "Registration failed" });
  }
}

async function loginUser(req, res) {
  console.log("REQ BODY:", req.body);
console.log("EMAIL TYPE:", typeof req.body.email);

  try {
    const email = req.body.email.toLowerCase();
    const password = req.body.password;

    const user = await userModel.findOne({ email });
    if (!user) {
      safeLog({
        actorId: null,
        actorRole: "system",
        action: "USER_LOGIN_FAILED",
        metadata: { email },
        req,
      });
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      safeLog({
        actorId: user._id,
        actorRole: "user",
        action: "USER_LOGIN_FAILED",
        metadata: { reason: "wrong_password" },
        req,
      });
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, cookieOptions);

    safeLog({
      actorId: user._id,
      actorRole: "user",
      action: "USER_LOGIN_SUCCESS",
      req,
    });

    const safeUser = user.toObject();
    delete safeUser.password;
    console.log("RAW BODY:", req.body);
    console.log("EMAIL:", `"${req.body.email}"`);
    console.log("PASSWORD:", `"${req.body.password}"`);

    res.json({ user: safeUser });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Login failed" });
  }
}

function logoutUser(req, res) {
  if (req.user) {
    safeLog({
      actorId: req.user._id,
      actorRole: "user",
      action: "USER_LOGOUT",
      req,
    });
  }
  res.clearCookie("token", cookieOptions);
  res.json({ message: "Logged out" });
}

/* ================= FOOD PARTNER AUTH ================= */

async function registerFoodPartner(req, res) {
  try {
    const email = req.body.email.toLowerCase();

    const exists = await foodPartnerModel.findOne({ email });
    if (exists) {
      safeLog({
        actorId: null,
        actorRole: "system",
        action: "PARTNER_REGISTER_FAILED",
        metadata: { email },
        req,
      });
      return res.status(400).json({ message: "Partner already exists" });
    }

    const hashed = await bcrypt.hash(req.body.password, 10);
    const partner = await foodPartnerModel.create({
      ...req.body,
      email,
      password: hashed,
    });

    const token = jwt.sign(
      { id: partner._id, role: "partner" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, cookieOptions);

    safeLog({
      actorId: partner._id,
      actorRole: "partner",
      action: "PARTNER_REGISTER_SUCCESS",
      req,
    });

    const safePartner = partner.toObject();
    delete safePartner.password;

    res.status(201).json({ foodPartner: safePartner });
  } catch (err) {
    console.error("Partner register error:", err.message);
    res.status(500).json({ message: "Partner registration failed" });
  }
}

async function loginFoodPartner(req, res) {
  try {
    const email = req.body.email.toLowerCase();
    const password = req.body.password;

    const partner = await foodPartnerModel.findOne({ email });
    if (!partner) {
      safeLog({
        actorId: null,
        actorRole: "system",
        action: "PARTNER_LOGIN_FAILED",
        metadata: { email },
        req,
      });
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, partner.password);
    if (!ok) {
      safeLog({
        actorId: partner._id,
        actorRole: "partner",
        action: "PARTNER_LOGIN_FAILED",
        metadata: { reason: "wrong_password" },
        req,
      });
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: partner._id, role: "partner" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, cookieOptions);

    safeLog({
      actorId: partner._id,
      actorRole: "partner",
      action: "PARTNER_LOGIN_SUCCESS",
      req,
    });

    const safePartner = partner.toObject();
    delete safePartner.password;

    res.json({ foodPartner: safePartner });
  } catch (err) {
    console.error("Partner login error:", err.message);
    res.status(500).json({ message: "Login failed" });
  }
}

function logoutFoodPartner(req, res) {
  if (req.user) {
    safeLog({
      actorId: req.user._id,
      actorRole: "partner",
      action: "PARTNER_LOGOUT",
      req,
    });
  }
  res.clearCookie("token", cookieOptions);
  res.json({ message: "Logged out" });
}

/* ================= PROFILE ================= */

async function updateUserAvatar(req, res) {
  const upload = await storageService.uploadFile(
    req.file.buffer,
    `avatar-${req.user._id}`
  );

  const user = await userModel
    .findByIdAndUpdate(req.user._id, { avatar: upload.url }, { new: true })
    .select("-password");

  safeLog({
    actorId: req.user._id,
    actorRole: "user",
    action: "USER_AVATAR_UPDATED",
    req,
  });

  res.json({ user });
}

async function updateFoodPartnerProfile(req, res) {
  const updates = { ...req.body };

  if (req.file) {
    const upload = await storageService.uploadFile(
      req.file.buffer,
      `logo-${uuid()}`
    );
    updates.logo = upload.url;
  }

  const partner = await foodPartnerModel
    .findByIdAndUpdate(req.user._id, updates, { new: true })
    .select("-password");

  safeLog({
    actorId: req.user._id,
    actorRole: "partner",
    action: "PARTNER_PROFILE_UPDATED",
    req,
  });

  res.json({ foodPartner: partner });
}

async function getCurrentUser(req, res) {
  res.json({ user: req.user });
}

async function getCurrentFoodPartner(req, res) {
  res.json({ foodPartner: req.user });
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  registerFoodPartner,
  loginFoodPartner,
  logoutFoodPartner,
  updateUserAvatar,
  updateFoodPartnerProfile,
  getCurrentUser,
  getCurrentFoodPartner,
};
