// src/routes/AppRoutes.jsx
import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

import ChooseRegister from "../pages/auth/ChooseRegister";
import UserRegister from "../pages/auth/UserRegister";
import UserLogin from "../pages/auth/UserLogin";
import FoodPartnerRegister from "../pages/auth/FoodPartnerRegister";
import FoodPartnerLogin from "../pages/auth/FoodPartnerLogin";

import Home from "../pages/general/Home";
import Saved from "../pages/general/Saved";
import TopNav from "../components/TopNav";
import CreateFood from "../pages/food-partner/createFood";
import Profile from "../pages/food-partner/Profile";
import UserProfile from "../pages/general/UserProfile";
import Search from "../pages/general/Search";
import BottomNav from "../components/BottomNav"


const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <h3>Loading...</h3>;
  return user ? children : <Navigate to="/user/login" replace />;
};

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/register" element={<ChooseRegister />} />
      <Route path="/user/register" element={<UserRegister />} />
      <Route path="/user/login" element={<UserLogin />} />

      <Route
        path="/"
        element={
          <PrivateRoute>
            <>
             <TopNav />
              <Home />
              
            </>
          </PrivateRoute>
        }
      />

      <Route
        path="/saved"
        element={
          <PrivateRoute>
            <>
             <TopNav />
              <Saved />
              
            </>
          </PrivateRoute>
        }
      />

      <Route
        path="/create-food"
        element={
          <PrivateRoute>
             <TopNav />
            <CreateFood />
          </PrivateRoute>
        }
      />

      <Route
        path="/food-partner/:id"
        element={
          <PrivateRoute>
             <TopNav />
            <Profile />
          </PrivateRoute>
        }
      />
    <Route
        path="/profile"
        element={
            <PrivateRoute>
            <UserProfile />
            </PrivateRoute>
        }
        />
      <Route path="*" element={<Navigate to="/" replace />} />
      <Route path="/search" element={<><Search /><BottomNav /></>}
/>

    </Routes>
  </Router>
);

export default AppRoutes;
