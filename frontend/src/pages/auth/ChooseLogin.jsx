import React from "react";
import { Link } from "react-router-dom";
import "../../styles/auth-shared.css";

const ChooseLogin = () => {
  return (
    <div className="auth-page-wrapper">
      <div className="auth-card">
        <h1 className="auth-title">Sign In</h1>
        <p className="auth-subtitle">Choose how you want to log in.</p>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <Link to="/user/login" className="auth-submit">
            Sign in as User
          </Link>

          <Link
            to="/food-partner/login"
            className="auth-submit"
            style={{
              background: "var(--color-surface-alt)",
              color: "var(--color-text)",
              border: "1px solid var(--color-border)",
            }}
          >
            Sign in as Food Partner
          </Link>
        </div>

        <div className="auth-alt-action">
          Don’t have an account? <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default ChooseLogin;
