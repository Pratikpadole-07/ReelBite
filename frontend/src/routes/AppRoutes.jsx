// src/routes/AppRoutes.jsx
import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import { AuthContext } from "../context/AuthContext";

/* Auth Pages */
import ChooseRegister from "../pages/auth/ChooseRegister";
import UserRegister from "../pages/auth/UserRegister";
import UserLogin from "../pages/auth/UserLogin";
import FoodPartnerRegister from "../pages/auth/FoodPartnerRegister";
import FoodPartnerLogin from "../pages/auth/FoodPartnerLogin";

/* General Pages */
import Home from "../pages/general/Home";
import Saved from "../pages/general/Saved";
import Search from "../pages/general/Search";
import UserProfile from "../pages/general/UserProfile";
import UserOrders from "../pages/general/Orders";

/* Food Partner Pages */
import CreateFood from "../pages/food-partner/createFood";
import RestaurantProfile from "../pages/food-partner/RestaurantProfile";
import EditRestaurant from "../pages/food-partner/EditRestaurant";
import MyUploads from "../pages/food-partner/MyUploads";
import PartnerOrders from "../pages/food-partner/Orders";
import OrderIntentDashboard from "../pages/food-partner/OrderIntentDashboard";

/* Layout */
import TopNav from "../components/TopNav";
import BottomNav from "../components/BottomNav";
import PartnerNavWrapper from "../pages/food-partner/PartnerNavWrapper";

/* -------------------- */
/* Private Route Guard  */
/* -------------------- */
const PrivateRoute = ({ children }) => {
  const { user, foodPartner, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return <h3>Loading...</h3>;

  const isPartnerRoute = location.pathname.startsWith("/food-partner");

  if (!user && !foodPartner) {
    return (
      <Navigate
        to={isPartnerRoute ? "/food-partner/login" : "/user/login"}
        replace
      />
    );
  }

  return children;
};

/* -------------------- */
/* App Routes */
/* -------------------- */
const AppRoutes = () => {
  return (
    <Router>
      <Routes>

        {/* -------- Public -------- */}
        <Route path="/register" element={<ChooseRegister />} />
        <Route path="/user/register" element={<UserRegister />} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/food-partner/register" element={<FoodPartnerRegister />} />
        <Route path="/food-partner/login" element={<FoodPartnerLogin />} />

        {/* -------- User Protected -------- */}
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
          path="/profile"
          element={
            <PrivateRoute>
              <UserProfile />
            </PrivateRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <UserOrders />
            </PrivateRoute>
          }
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

        {/* -------- Food Partner Protected -------- */}
        <Route
          path="/food-partner/:id"
          element={
            <PrivateRoute>
              <PartnerNavWrapper>
                <RestaurantProfile />
              </PartnerNavWrapper>
            </PrivateRoute>
          }
        />

        <Route
          path="/food-partner/create-food"
          element={
            <PrivateRoute>
              <PartnerNavWrapper>
                <CreateFood />
              </PartnerNavWrapper>
            </PrivateRoute>
          }
        />

        <Route
          path="/food-partner/my-uploads"
          element={
            <PrivateRoute>
              <PartnerNavWrapper>
                <MyUploads />
              </PartnerNavWrapper>
            </PrivateRoute>
          }
        />

        <Route
          path="/food-partner/order-intents"
          element={
            <PrivateRoute>
              <PartnerNavWrapper>
                <OrderIntentDashboard />
              </PartnerNavWrapper>
            </PrivateRoute>
          }
        />

        <Route
          path="/food-partner/orders"
          element={
            <PrivateRoute>
              <PartnerNavWrapper>
                <PartnerOrders />
              </PartnerNavWrapper>
            </PrivateRoute>
          }
        />

        <Route
          path="/food-partner/edit"
          element={
            <PrivateRoute>
              <PartnerNavWrapper>
                <EditRestaurant />
              </PartnerNavWrapper>
            </PrivateRoute>
          }
        />

        {/* -------- Fallback -------- */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
};

export default AppRoutes;
