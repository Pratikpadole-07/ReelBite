import React, { useContext, useState, useEffect } from "react";
import "../../styles/user-login.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import socket from "../../socket";

const UserLogin = () => {
  const navigate = useNavigate();
  const { loginUser, user } = useContext(AuthContext);
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

      if (status === 429) setError("Too many attempts. Try again later.");
      else if (status === 400) setError("Invalid email or password.");
      else setError("Login failed. Please try again.");
    }
  };

  useEffect(() => {
    if (user?._id) {
      socket.emit("join-user", user._id);
    }
  }, [user]);

  return (
    <div className="login-page">
      <div className="login-card">
        <header className="login-header">
          <h1>Welcome back</h1>
          <p>Sign in to continue ordering</p>
        </header>

        {error && <div className="login-error">{error}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" required />
          </div>

          <button className="login-btn" type="submit">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserLogin;
