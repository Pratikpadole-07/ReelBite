import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/topnav.css";

const TopNav = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/user/login");
  };

  return (
    <nav className="topnav">
      <Link to="/" className="nav-logo">🍽 ReelBite</Link>

      <div className="nav-links">
        {user && (
          <>
            <Link to="/">Home</Link>
            <Link to="/saved">Saved</Link>
          </>
        )}

        {/* Only visible if logged in as Food Partner */}
        {user?.role === "foodpartner" && (
          <Link to="/create-food">Upload</Link>
        )}

        {user ? (
          <>
             <Link to="/profile" className="nav-link">👤 Profile</Link>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <Link to="/user/login">Login</Link>
        )}
       
      </div>
    </nav>
  );
};

export default TopNav;
