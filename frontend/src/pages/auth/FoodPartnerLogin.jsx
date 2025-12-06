import React, { useContext, useState } from 'react';
import '../../styles/auth-shared.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../../context/AuthContext";

const FoodPartnerLogin = () => {
  const navigate = useNavigate();
  const { loginPartner } = useContext(AuthContext);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/food-partner/login",
        { email, password },
        { withCredentials: true }
      );

      loginPartner(res.data.foodPartner); // ⬅ Update global context

      navigate(`/food-partner/${res.data.foodPartner._id}`); // ⬅ Redirect to dashboard
    } catch (err) {
      setError("Invalid email or password ❌");
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
          New partner? <a href="/partner/register">Create account</a>
        </p>
      </div>
    </div>
  );
};

export default FoodPartnerLogin;
