// src/routes/AppRoutes.jsx
import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import { AuthContext } from "../context/AuthContext";

/* Auth Pages */
import ChooseRegister from "../pages/auth/ChooseRegister";
import ChooseLogin from "../pages/auth/ChooseLogin";
import UserRegister from "../pages/auth/UserRegister";
import UserLogin from "../pages/auth/UserLogin";
import FoodPartnerRegister from "../pages/auth/FoodPartnerRegister";
import FoodPartnerLogin from "../pages/auth/FoodPartnerLogin";

/* User Pages */
import Home from "../pages/general/Home";
import Saved from "../pages/general/Saved";
import UserProfile from "../pages/general/UserProfile";
import UserOrders from "../pages/general/Orders";
import Search from "../pages/general/Search";

/* Partner Pages */
import CreateFood from "../pages/food-partner/createFood";
import RestaurantProfile from "../pages/food-partner/RestaurantProfile";
import EditRestaurant from "../pages/food-partner/EditRestaurant";
import MyUploads from "../pages/food-partner/MyUploads";
import PartnerOrders from "../pages/food-partner/Orders";
import OrderIntentDashboard from "../pages/food-partner/OrderIntentDashboard";
import RestaurantProfilePublic from "../pages/food-partner/RestaurantProfilePublic"
/* Layout */
import TopNav from "../components/TopNav";
import BottomNav from "../components/BottomNav";
import PartnerNavWrapper from "../pages/food-partner/PartnerNavWrapper";

/* -------------------- */
/* Private Route Guard */
/* -------------------- */
const PrivateRoute = ({ children, role }) => {
  const { user, foodPartner, loading } = useContext(AuthContext);

  if (loading) return <h3>Loading...</h3>;

  if (!user && !foodPartner) {
    return <Navigate to="/register" replace />;
  }

  if (role === "user" && !user) {
    return <Navigate to="/register" replace />;
  }

  if (role === "partner" && !foodPartner) {
    return <Navigate to="/register" replace />;
  }

  return children;
};
const RootRedirect = () => {
  const { user, foodPartner, loading } = useContext(AuthContext);

  if (loading) return <h3>Loading...</h3>;

  if (user) return <Navigate to="/home" replace />;
  if (foodPartner) return <Navigate to="/food-partner/orders" replace />;

  return <Navigate to="/register" replace />;
};


/* -------------------- */
/* App Routes */
/* -------------------- */
const AppRoutes = () => {
  return (
    <Router>
      <Routes>

        {/* ---------- ENTRY ---------- */}
        <Route path="/" element={<RootRedirect />} />

        {/* ---------- PUBLIC ---------- */}
        <Route path="/register" element={<ChooseRegister />} />
        <Route path="/login" element={<ChooseLogin />} />

        <Route path="/user/register" element={<UserRegister />} />
        <Route path="/user/login" element={<UserLogin />} />

        <Route path="/food-partner/register" element={<FoodPartnerRegister />} />
        <Route path="/food-partner/login" element={<FoodPartnerLogin />} />
        <Route
          path="/restaurant/:id"
          element={<RestaurantProfilePublic />}
        />


        <Route
          path="/search"
          element={
            <>
              <Search />
              <BottomNav />
            </>
          }
        />

        {/* ---------- USER PROTECTED ---------- */}
        <Route
          path="/home"
          element={
            <PrivateRoute role="user">
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
            <PrivateRoute role="user">
              <>
                <TopNav />
                <Saved />
              </>
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute role="user">
              <UserProfile />
            </PrivateRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <PrivateRoute role="user">
              <UserOrders />
            </PrivateRoute>
          }
        />

        {/* ---------- PARTNER PROTECTED ---------- */}
        <Route
          path="/food-partner/create-food"
          element={
            <PrivateRoute role="partner">
              <PartnerNavWrapper>
                <CreateFood />
              </PartnerNavWrapper>
            </PrivateRoute>
          }
        />

        <Route
          path="/food-partner/my-uploads"
          element={
            <PrivateRoute role="partner">
              <PartnerNavWrapper>
                <MyUploads />
              </PartnerNavWrapper>
            </PrivateRoute>
          }
        />

        <Route
          path="/food-partner/order-intents"
          element={
            <PrivateRoute role="partner">
              <PartnerNavWrapper>
                <OrderIntentDashboard />
              </PartnerNavWrapper>
            </PrivateRoute>
          }
        />

        <Route
          path="/food-partner/orders"
          element={
            <PrivateRoute role="partner">
              <PartnerNavWrapper>
                <PartnerOrders />
              </PartnerNavWrapper>
            </PrivateRoute>
          }
        />

        <Route
          path="/food-partner/edit"
          element={
            <PrivateRoute role="partner">
              <PartnerNavWrapper>
                <EditRestaurant />
              </PartnerNavWrapper>
            </PrivateRoute>
          }
        />

        <Route
          path="/food-partner/dashboard"
          element={
            <PrivateRoute role="partner">
              <PartnerNavWrapper>
                <RestaurantProfile />
              </PartnerNavWrapper>
           </PrivateRoute>
          }
        />



        {/* ---------- FALLBACK ---------- */}
        <Route path="*" element={<RootRedirect />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
