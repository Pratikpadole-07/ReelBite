const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const storageService = require("../services/storage.service");
const { v4: uuid } = require("uuid");
const foodPartnerModel = require("../models/foodpartner.model");

// Cookie Options (Reuse everywhere)
const cookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: false,
  path: "/"
};

// ----------------------- USER AUTH ----------------------- //

async function registerUser(req, res) {
  try {
    const { fullName, email, password } = req.body;

    const isUserAlreadyExists = await userModel.findOne({ email });
    if (isUserAlreadyExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      fullName,
      email,
      password: hashedPassword
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.cookie("token", token, cookieOptions);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.cookie("token", token, cookieOptions);

    res.status(200).json({
      message: "User logged in successfully",
      user: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
        avatar: user.avatar
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

function logoutUser(req, res) {
  res.clearCookie("token", cookieOptions);
  res.status(200).json({ message: "User logged out successfully" });
}

// ----------------------- FOOD PARTNER ----------------------- //

async function registerFoodPartner(req, res) {
  try {
    const requiredFields = [
      "name",
      "email",
      "password",
      "phone",
      "address",
      "contactName",
      "city",
      "state",
      "pincode"
    ];

    const missing = requiredFields.filter(
      (field) => !req.body[field] || req.body[field].trim() === ""
    );

    if (missing.length > 0) {
      return res.status(400).json({
        message: "Missing required fields",
        missing
      });
    }

    const { name, email, password, phone, address, contactName, city, state, pincode } = req.body;

    const existingAccount = await foodPartnerModel.findOne({ email });
    if (existingAccount) {
      return res.status(400).json({ message: "Food partner already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const foodPartner = await foodPartnerModel.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      contactName,
      city,
      state,
      pincode
    });

    const token = jwt.sign({ id: foodPartner._id }, process.env.JWT_SECRET);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/"
    });

    res.status(201).json({
      success: true,
      message: "Food partner registered successfully",
      foodPartner
    });

  } catch (error) {
    console.error("Register FP Error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}


async function loginFoodPartner(req, res) {
  try {
    const { email, password } = req.body;
    const foodPartner = await foodPartnerModel.findOne({ email });

    if (!foodPartner)
      return res.status(400).json({ message: "Invalid credentials" });

    const isPasswordValid = await bcrypt.compare(password, foodPartner.password);
    if (!isPasswordValid)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: foodPartner._id }, process.env.JWT_SECRET);
    res.cookie("token", token, cookieOptions);

    res.status(200).json({
      message: "Food partner logged in successfully",
      foodPartner: {
        _id: foodPartner._id,
        email: foodPartner.email,
        name: foodPartner.name
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

function logoutFoodPartner(req, res) {
  res.clearCookie("token", cookieOptions);
  res.status(200).json({ message: "Food partner logged out successfully" });
}

// ----------------------- UPDATE USER AVATAR ----------------------- //

async function updateUserAvatar(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const uploaded = await storageService.uploadFile(req.file.buffer, uuid());

    const user = await userModel.findByIdAndUpdate(
      req.user._id,
      { avatar: uploaded.url },
      { new: true }
    ).select("-password");

    res.json({ success: true, user });
  } catch (err) {
    console.error("Avatar Upload Error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

async function getFoodPartnerDetails(req, res) {
  const partner = await foodPartnerModel.findById(req.user._id).select("-password");
  if (!partner) return res.status(404).json({ message: "Not found" });
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
  getFoodPartnerDetails
};
