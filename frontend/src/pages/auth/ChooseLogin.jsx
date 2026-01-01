import React from "react";
import { Link } from "react-router-dom";
import "../../styles/choose-login.css";

const ChooseLogin = () => {
  return (
    <div className="choose-page">
      <div className="choose-card" role="region" aria-labelledby="choose-login-title">
        <header className="choose-header">
          <h1 id="choose-login-title">Sign In</h1>
          <p>Select how you want to access your account</p>
        </header>

        <div className="role-options">
          <Link to="/user/login" className="role-card primary">
            <h2>User</h2>
            <p>Order food and explore reels</p>
          </Link>

          <Link to="/food-partner/login" className="role-card secondary">
            <h2>Food Partner</h2>
            <p>Manage uploads and incoming orders</p>
          </Link>
        </div>

        <footer className="choose-footer">
          <span>New here?</span>
          <Link to="/register">Create an account</Link>
        </footer>
      </div>
    </div>
  );
};

export default ChooseLogin;
