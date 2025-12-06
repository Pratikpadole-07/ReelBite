import React from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../assets/api/api";

// 🔥 custom axios instance
import "../../styles/auth-shared.css";

const FoodPartnerRegister = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      name: e.target.businessName.value,
      contactName: e.target.contactName.value,
      phone: e.target.phone.value,
      email: e.target.email.value,
      password: e.target.password.value,
      address: e.target.address.value,
      city: e.target.city.value,
      state: e.target.state.value,
      pincode: e.target.pincode.value,
    };

    try {
      const res = await api.post("/auth/food-partner/register", formData);
      const id = res.data.foodPartner._id;

      navigate(`/food-partner/${id}`);
    } catch (err) {
  console.log("Error Response:", err.response?.data);
  alert(
    err.response?.data?.message +
      "\nMissing: " +
      (err.response?.data?.missing?.join(", ") || "None")
  );
}

  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card">
        <header>
          <h1 className="auth-title">Partner Sign Up</h1>
          <p className="auth-subtitle">Grow your restaurant with our platform.</p>
        </header>

        <nav className="auth-alt-action">
          <strong>Switch:</strong>&nbsp;
          <Link to="/user/register">User</Link> •{" "}
          <Link to="/food-partner/register">Food partner</Link>
        </nav>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="field-group">
            <label>Business Name</label>
            <input name="businessName" required />
          </div>

          <div className="two-col">
            <div className="field-group">
              <label>Contact Name</label>
              <input name="contactName" required />
            </div>

            <div className="field-group">
              <label>Phone</label>
              <input name="phone" required />
            </div>
          </div>

          <div className="field-group">
            <label>Email</label>
            <input name="email" type="email" required />
          </div>

          <div className="field-group">
            <label>Password</label>
            <input name="password" type="password" required />
          </div>

          <div className="two-col">
            <div className="field-group">
              <label>City</label>
              <input name="city" required />
            </div>

            <div className="field-group">
              <label>State</label>
              <input name="state" required />
            </div>
          </div>

          <div className="field-group">
            <label>Pincode</label>
            <input name="pincode" required />
          </div>

          <div className="field-group">
            <label>Address</label>
            <input name="address" required />
          </div>

          <button className="auth-submit" type="submit">
            Create Partner Account
          </button>
        </form>

        <div className="auth-alt-action">
          Already a partner? <Link to="/food-partner/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default FoodPartnerRegister;
