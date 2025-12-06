const foodPartnerModel = require("../models/foodpartner.model");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

async function authFoodPartnerMiddleware(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Please login first" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const foodPartner = await foodPartnerModel
      .findById(decoded.id)
      .select("-password");

    if (!foodPartner) {
      return res.status(401).json({ message: "Unauthorized partner" });
    }

    req.foodPartner = foodPartner; // 🔥 FIXED
    next();
  } catch (err) {
    console.log("Food Partner Auth Error:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

async function authUserMiddleware(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Please login first" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.log("User Auth Error:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports = {
  authFoodPartnerMiddleware,
  authUserMiddleware
};
