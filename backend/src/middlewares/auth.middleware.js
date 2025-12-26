const jwt = require("jsonwebtoken");
const foodPartnerModel = require("../models/foodpartner.model");
const userModel = require("../models/user.model");

/* ================= USER AUTH ================= */
async function authUserMiddleware(req, res, next) {
  try {
    const token = req.cookies.user_token;
    if (!token) {
      return res.status(401).json({ message: "User token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "user") {
      return res.status(403).json({ message: "User access only" });
    }

    const user = await userModel.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    return next();
  } catch (err) {
    console.error("User auth error:", err.message);
    return res.status(401).json({ message: "Unauthorized" });
  }
}

/* ================= PARTNER AUTH ================= */
async function authFoodPartnerMiddleware(req, res, next) {
  try {
    const token = req.cookies.partner_token;
    if (!token) {
      return res.status(401).json({ message: "Partner token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "partner") {
      return res.status(403).json({ message: "Partner access only" });
    }

    const partner = await foodPartnerModel
      .findById(decoded.id)
      .select("-password");

    if (!partner) {
      return res.status(401).json({ message: "Partner not found" });
    }

    req.user = partner;
    return next();
  } catch (err) {
    console.error("Partner auth error:", err.message);
    return res.status(401).json({ message: "Unauthorized" });
  }
}

module.exports = {
  authUserMiddleware,
  authFoodPartnerMiddleware,
};
