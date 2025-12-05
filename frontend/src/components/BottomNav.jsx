import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/bottom-nav.css";

const BottomNav = () => {
  return (
    <div className="bottom-nav">
      <NavLink to="/" end className="nav-icon">🏠</NavLink>
      <NavLink to="/search" className="nav-icon">🔍</NavLink>
      <NavLink to="/create-food" className="nav-icon upload-btn">➕</NavLink>
      <NavLink to="/saved" className="nav-icon">🔖</NavLink>
      <NavLink to="/profile" className="nav-icon">👤</NavLink>
    </div>
  );
};

export default BottomNav;
