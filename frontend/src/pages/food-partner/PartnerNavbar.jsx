import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/PartnerNavbar.css";
import { AuthContext } from "../../context/AuthContext";

const PartnerNavbar = () => {
  const { foodPartner, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!foodPartner) return null;

  const handleLogout = async () => {
    await logout();
    navigate("/food-partner/login");
  };

  return (
    <nav className="partner-navbar">
      <div className="partner-navbar-left">
        <span className="logo">🍽 ReelBite Partner</span>
      </div>

      <div className="partner-navbar-center">
        <Link to="/food-partner/orders">Orders</Link>
        <Link to="/food-partner/dashboard">Profile</Link>
        <Link to="/food-partner/create-food">Add Reel</Link>
        <Link to="/food-partner/order-intents">Order Intents</Link>
      </div>

      <div className="partner-navbar-right">
        <span className="partner-name">{foodPartner.name}</span>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default PartnerNavbar;
