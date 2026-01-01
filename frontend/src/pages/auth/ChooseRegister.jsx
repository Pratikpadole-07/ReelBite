import React from "react";
import { Link } from "react-router-dom";
import "../../styles/choose-register.css";

const ChooseRegister = () => {
  return (
    <div className="choose-page">
      <div
        className="choose-card"
        role="region"
        aria-labelledby="choose-register-title"
      >
        <header className="choose-header">
          <h1 id="choose-register-title">Join ReelBite</h1>
          <p>Select how you want to use the platform</p>
        </header>

        <div className="role-options">
          <Link to="/user/register" className="role-card primary">
            <h2>User</h2>
            <p>Discover food reels and order instantly</p>
          </Link>

          <Link to="/food-partner/register" className="role-card secondary">
            <h2>Food Partner</h2>
            <p>Upload food, receive orders, grow your business</p>
          </Link>
        </div>

        <footer className="choose-footer">
          <span>Already registered?</span>
          <Link to="/login">Sign in</Link>
        </footer>
      </div>
    </div>
  );
};

export default ChooseRegister;
