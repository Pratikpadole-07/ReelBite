import React, { useContext, useState, useEffect } from "react";
import "../../styles/food-partner-login.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import socket from "../../socket";

const FoodPartnerLogin = () => {
  const navigate = useNavigate();
  const { loginFoodPartner, foodPartner } = useContext(AuthContext);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      await loginFoodPartner(email, password);
      navigate("/food-partner/my-uploads");
    } catch (err) {
      const status = err.response?.status;

      if (status === 429) setError("Too many attempts. Try again later.");
      else if (status === 400) setError("Invalid email or password.");
      else setError("Login failed. Please try again.");
    }
  };

  useEffect(() => {
    if (foodPartner?._id) {
      socket.emit("join-partner", foodPartner._id);
    }
  }, [foodPartner]);

  return (
    <div className="partner-login-page">
      <div className="partner-login-card">
        <header className="partner-login-header">
          <h1>Partner Login</h1>
          <p>Access your dashboard and manage orders</p>
        </header>

        {error && <div className="partner-login-error">{error}</div>}

        <form className="partner-login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="partner-email">Email</label>
            <input
              id="partner-email"
              name="email"
              type="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="partner-password">Password</label>
            <input
              id="partner-password"
              name="password"
              type="password"
              required
            />
          </div>

          <button className="partner-login-btn" type="submit">
            Sign In
          </button>
        </form>

        <footer className="partner-login-footer">
          <span>New partner?</span>
          <a href="/food-partner/register">Create account</a>
        </footer>
      </div>
    </div>
  );
};

export default FoodPartnerLogin;
