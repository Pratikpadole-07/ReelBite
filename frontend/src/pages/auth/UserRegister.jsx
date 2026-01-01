import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/user-register.css";

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
      await axios.post(
        `${API_URL}/auth/user/register`,
        {
          fullName: `${firstName} ${lastName}`,
          email,
          password,
        },
        { withCredentials: true }
      );

      await axios.get(`${API_URL}/auth/user/me`, {
        withCredentials: true,
      });

      navigate("/");
    } catch (err) {
      console.error("Registration error:", err);
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="user-register-page">
      <div className="user-register-card" role="region">
        <header className="user-register-header">
          <h1>Create your account</h1>
          <p>Join to discover food reels and order instantly</p>
        </header>

        <nav className="user-register-switch">
          <span>Switch:</span>
          <Link to="/user/register" className="active">
            User
          </Link>
          <span>•</span>
          <Link to="/food-partner/register">Food Partner</Link>
        </nav>

        <form className="user-register-form" onSubmit={handleSubmit}>
          <section className="form-section">
            <h3>Personal Details</h3>

            <div className="two-col">
              <div className="form-group">
                <label>First Name</label>
                <input name="firstName" required />
              </div>

              <div className="form-group">
                <label>Last Name</label>
                <input name="lastName" required />
              </div>
            </div>
          </section>

          <section className="form-section">
            <h3>Account Credentials</h3>

            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" required />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" required />
            </div>
          </section>

          <button className="user-register-btn" type="submit">
            Sign Up
          </button>
        </form>

        <footer className="user-register-footer">
          <span>Already have an account?</span>
          <Link to="/user/login">Sign in</Link>
        </footer>
      </div>
    </div>
  );
};

export default UserRegister;
