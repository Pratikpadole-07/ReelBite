const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes');
const foodRoutes = require('./routes/food.routes');
const foodPartnerRoutes = require('./routes/food-partner.routes');
const cors = require('cors');

const app = express();

// CORS FIRST
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

// COOKIE PARSER BEFORE ROUTES
app.use(cookieParser());

// JSON PARSER
app.use(express.json());

// STATIC FILES
app.use('/vdeos', express.static(path.join(__dirname, '../../vdeos')));

app.get("/", (req, res) => {
    res.send("Hello world");
});

// ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/food-partner', foodPartnerRoutes);

module.exports = app;
