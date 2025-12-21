const jwt = require("jsonwebtoken");
const foodPartnerModel = require("../models/foodpartner.model");
const userModel = require("../models/user.model");

async function authUserMiddleware(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "user") {
      return res.status(403).json({ message: "User access only" });
    }

    const user = await userModel.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "Invalid user" });

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
}


async function authFoodPartnerMiddleware(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "No token" });
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
    next();
  } catch (err) {
    console.error("Partner auth error:", err.message);
    return res.status(401).json({ message: "Unauthorized" });
  }
}

module.exports = {
  authUserMiddleware,
  authFoodPartnerMiddleware,
};
