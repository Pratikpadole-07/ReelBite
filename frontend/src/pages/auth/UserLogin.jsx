import React, { useContext, useState } from "react";
import "../../styles/auth-shared.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const UserLogin = () => {
  const navigate = useNavigate();
  const { loginUser } = useContext(AuthContext);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      await loginUser(email, password);
      navigate("/home");
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.message;

      if (status === 429) {
        setError(message || "Too many attempts. Try later.");
      } else if (status === 400) {
        setError("Invalid email or password ❌");
      } else {
        setError("Login failed. Try again.");
      }
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card">
        <h1 className="auth-title">Welcome back</h1>

        {error && <p className="error-text">{error}</p>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>Email</label>
          <input name="email" type="email" required />

          <label>Password</label>
          <input name="password" type="password" required />

          <button className="auth-submit">Sign In</button>
        </form>
      </div>
    </div>
  );
};

export default UserLogin;
