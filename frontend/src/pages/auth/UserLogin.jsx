// src/pages/auth/UserLogin.jsx
import React, { useContext } from "react";
import "../../styles/auth-shared.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const UserLogin = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card">
        <h1>Welcome back</h1>
        <form onSubmit={handleSubmit}>
          <input id="email" name="email" type="email" placeholder="Email" />
          <input id="password" name="password" type="password" placeholder="Password" />
          <button type="submit">Sign In</button>
        </form>
      </div>
    </div>
  );
};

export default UserLogin;
