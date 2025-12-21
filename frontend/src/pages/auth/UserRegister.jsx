import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/auth-shared.css";

const API_URL = "http://localhost:3000/api";

const UserRegister = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const firstName = e.target.firstName.value.trim();
    const lastName = e.target.lastName.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;

    try {
      // 1️⃣ Register user (backend sets cookie)
      await axios.post(
        `${API_URL}/auth/user/register`,
        {
          fullName: `${firstName} ${lastName}`,
          email,
          password,
        },
        { withCredentials: true }
      );

      // 2️⃣ Warm up auth (ensures cookie is available)
      await axios.get(`${API_URL}/auth/user/me`, {
        withCredentials: true,
      });

      // 3️⃣ Navigate to home
      navigate("/");
    } catch (err) {
      console.error("Registration error:", err);
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card" role="region">
        <header>
          <h1 className="auth-title">Create your account</h1>
          <p className="auth-subtitle">
            Join to explore and enjoy delicious meals.
          </p>
        </header>

        <nav className="auth-alt-action">
          <strong>Switch:</strong>{" "}
          <Link to="/user/register">User</Link> •{" "}
          <Link to="/food-partner/register">Food partner</Link>
        </nav>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="two-col">
            <div className="field-group">
              <label>First Name</label>
              <input name="firstName" required />
            </div>
            <div className="field-group">
              <label>Last Name</label>
              <input name="lastName" required />
            </div>
          </div>

          <div className="field-group">
            <label>Email</label>
            <input type="email" name="email" required />
          </div>

          <div className="field-group">
            <label>Password</label>
            <input type="password" name="password" required />
          </div>

          <button className="auth-submit" type="submit">
            Sign Up
          </button>
        </form>

        <div className="auth-alt-action">
          Already have an account? <Link to="/user/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default UserRegister;
