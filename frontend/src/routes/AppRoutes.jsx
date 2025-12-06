// src/routes/AppRoutes.jsx
import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

import ChooseRegister from "../pages/auth/ChooseRegister";
import UserRegister from "../pages/auth/UserRegister";
import UserLogin from "../pages/auth/UserLogin";
import FoodPartnerRegister from "../pages/auth/FoodPartnerRegister";
import FoodPartnerLogin from "../pages/auth/FoodPartnerLogin";
import Home from "../pages/general/Home";
import Saved from "../pages/general/Saved";
import TopNav from "../components/TopNav";
import CreateFood from "../pages/food-partner/CreateFood";
import Profile from "../pages/food-partner/RestaurantProfile";
import UserProfile from "../pages/general/UserProfile";
import Search from "../pages/general/Search";
import BottomNav from "../components/BottomNav";
import MyUploads from "../pages/food-partner/MyUploads";
import EditRestaurant from "../pages/food-partner/EditRestaurant";



const PrivateRoute = ({ children }) => {
  const { user, foodPartner, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return <h3>Loading...</h3>;

  const isPartnerRoute = location.pathname.startsWith("/food-partner");

  if (!user && !foodPartner) {
    return <Navigate to={isPartnerRoute ? "/food-partner/login" : "/user/login"} replace />;
  }

  return children;
};

const AppRoutes = () => (
  <Router>
    <Routes>
      {/* Public Routes */}
      <Route path="/register" element={<ChooseRegister />} />
      <Route path="/user/register" element={<UserRegister />} />
      <Route path="/user/login" element={<UserLogin />} />
      <Route path="/food-partner/register" element={<FoodPartnerRegister />} />
      <Route path="/food-partner/login" element={<FoodPartnerLogin />} />

      {/* Protected Routes */}
      <Route path="/" element={<PrivateRoute><><TopNav /><Home /></></PrivateRoute>} />
      <Route path="/saved" element={<PrivateRoute><><TopNav /><Saved /></></PrivateRoute>} />

      <Route
        path="/food-partner/create-food"
        element={
          <PrivateRoute>
            <CreateFood />
          </PrivateRoute>
        }
      />


      <Route path="/food-partner/:id" element={<PrivateRoute><><TopNav /><Profile /></></PrivateRoute>} />

      <Route path="/profile" element={<PrivateRoute><><UserProfile /></></PrivateRoute>} />

      <Route
        path="/food-partner/my-uploads"
        element={
          <PrivateRoute>
            <MyUploads />
          </PrivateRoute>
        }
      />
    <Route
        path="/food-partner/edit"
        element={
          <PrivateRoute>
            <EditRestaurant />
          </PrivateRoute>
        }
      />


      <Route path="/search" element={<><Search /><BottomNav /></>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Router>
);

export default AppRoutes;
