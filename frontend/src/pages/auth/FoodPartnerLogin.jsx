import React, { useContext, useState } from "react";
import "../../styles/auth-shared.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const FoodPartnerLogin = () => {
  const navigate = useNavigate();
  const { loginFoodPartner } = useContext(AuthContext);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      await loginFoodPartner(email, password);
      navigate("/food-partner/my-uploads"); // ✅ EXISTING ROUTE
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.message;

      if (status === 429) {
        setError(message || "Too many attempts. Try later.");
      } else if (status === 400) {
        setError("Invalid email or password ❌");
      } else {
        setError("Something went wrong. Try again.");
      }
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card">
        <h2 className="auth-title">Partner Login</h2>

        {error && <p className="error-text">{error}</p>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>Email</label>
          <input name="email" type="email" required />

          <label>Password</label>
          <input name="password" type="password" required />

          <button className="auth-submit">Sign In</button>
        </form>

        <p className="auth-alt-action">
          New partner? <a href="/food-partner/register">Create account</a>
        </p>
      </div>
    </div>
  );
};

export default FoodPartnerLogin;
