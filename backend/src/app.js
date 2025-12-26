const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const foodRoutes = require("./routes/food.routes");
const foodPartnerRoutes = require("./routes/food-partner.routes");
const orderRoutes = require("./routes/order.routes");
const orderIntentRoutes = require("./routes/orderIntent.routes");

const app = express();

/* ================== MIDDLEWARE ORDER MATTERS ================== */

// 1️⃣ CORS MUST COME FIRST
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);

// 2️⃣ COOKIE PARSER AFTER CORS
app.use(cookieParser());

// 3️⃣ BODY PARSER
app.use(express.json());

// 4️⃣ STATIC (optional)
app.use("/videos", express.static(path.join(__dirname, "../../videos")));

/* ================== ROUTES ================== */

app.get("/", (req, res) => {
  res.send("Server running");
});

app.use("/api/auth", authRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/food-partner", foodPartnerRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/order-intent", orderIntentRoutes);

module.exports = app;
