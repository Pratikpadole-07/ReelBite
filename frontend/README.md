ReelBite 🍔🎬

Short-Video Food Discovery & Ordering Platform

ReelBite is a full-stack web application inspired by short-video platforms, built for food discovery, restaurant engagement, and real-time ordering.
It supports user and food-partner roles, real-time order updates, infinite reel scrolling, and concurrency-safe order state management.

This project focuses on backend correctness, real-world race conditions, and scalable feed design, not just UI.


🚀 Live Demo

Frontend: <ADD_FRONTEND_URL>

Backend API: <ADD_BACKEND_URL>


🧠 Core Features
👤 User Features

Browse food reels with infinite scrolling (cursor-based pagination)

Search food by name

Filter by category

Follow food partners and view Following-only feed

Like, save, and comment on reels

Place food orders

View real-time order status timeline via WebSockets

🏪 Food Partner Features

Upload food reels (video-based)

Manage incoming orders

Update order status with atomic state transitions

View order analytics and trends

⚙️ Platform Features

JWT-based authentication (User & Partner roles)

Optional authentication for public feeds

Cursor-based pagination (no page numbers)

WebSocket-based real-time updates

Concurrency-safe order status updates

Modular backend architecture

🏗️ System Architecture (High Level)
Frontend (React + Vite)
        |
        | REST + Cookies
        v
Backend (Node.js + Express)
        |
        | MongoDB (Atomic Queries)
        v
Database (MongoDB)
        |
        | WebSockets
        v
Realtime Order Updates

🔐 Concurrency & Data Integrity

ReelBite handles real-world race conditions during order updates.

Problem

Multiple requests can attempt to update the same order simultaneously.

Solution

Order status updates are enforced using atomic database queries, not application-level locks.

Key properties:

Single atomic findOneAndUpdate

Status transition validation

Idempotent updates

Safe under concurrent requests

This prevents:

Duplicate state transitions

Corrupted order history

Inconsistent analytics

🧰 Tech Stack
Frontend

React.js

Vite

React Router

IntersectionObserver API (infinite scroll + autoplay)

Socket.io Client

Backend

Node.js

Express.js

MongoDB + Mongoose

Socket.io

JWT Authentication

Multer (file uploads)

Infrastructure

Cursor-based pagination

REST APIs

WebSockets for real-time updates

📁 Project Structure
ReelBite/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   ├── services/
│   │   └── app.js
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── styles/
│   └── main.jsx

🔑 Environment Variables

Create .env files for backend and frontend.

Backend .env
PORT=3000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret

Frontend .env
VITE_API_BASE_URL=your_backend_url


⚠️ Never commit real secrets to GitHub.

▶️ Running Locally
Backend
cd backend
npm install
node server.js

Frontend
cd frontend
npm install
npm run dev

📈 Scalability Notes

Cursor-based pagination prevents feed duplication and skip issues

Indexed MongoDB queries for feeds and analytics

Stateless backend (JWT)

WebSocket rooms scoped per user/order

🎯 What This Project Demonstrates

Real-world backend problem solving

Safe concurrent data handling

Clean API design

Production-style pagination

Role-based access control

Full-stack integration

This is not a CRUD demo.
It is a system-thinking project.

Logical Flow (What Actually Happens)

┌────────────┐
│  Frontend  │  React + Vite
│            │
│ - Reel Feed (Infinite Scroll)
│ - Search / Category Filters
│ - Orders & Status Timeline
│ - WebSocket Client
└─────┬──────┘
      │ HTTP (REST) + Cookies (JWT)
      │
┌─────▼──────┐
│  Backend   │  Node.js + Express
│            │
│ - Auth (User / Partner)
│ - Feed APIs (Cursor-based)
│ - Order Management
│ - Atomic Status Updates
│ - WebSocket Server
└─────┬──────┘
      │ Mongoose ODM
      │
┌─────▼──────┐
│  MongoDB   │
│            │
│ - Users
│ - Food Reels
│ - Orders
│ - Likes / Saves / Comments
│ - Status History
└────────────┘

Real-Time Order Updates (WebSocket Layer)

Order Status Change
        │
        ▼
MongoDB Atomic Update
        │
        ▼
Backend emits event
        │
        ▼
Socket.io Rooms
(user:<id>, partner:<id>)
        │
        ▼
Live UI Update
(No polling)

🧑‍💻 Author

Pratik Padole
Third-Year Engineering Student
Interested in Backend Engineering & Full-Stack Development

📌 Future Improvements

Recommendation engine for reels

Order ETA prediction

Advanced search indexing

Payment integration

Push notifications