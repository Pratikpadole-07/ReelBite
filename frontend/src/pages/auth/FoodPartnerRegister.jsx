import React from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../assets/api/api";
import "../../styles/food-partner-register.css";

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
    <div className="partner-register-page">
      <div className="partner-register-card">
        <header className="partner-register-header">
          <h1>Partner Sign Up</h1>
          <p>Register your restaurant and start receiving orders</p>
        </header>

        <nav className="partner-switch">
          <span>Switch:</span>
          <Link to="/user/register">User</Link>
          <span>•</span>
          <Link to="/food-partner/register" className="active">
            Food Partner
          </Link>
        </nav>

        <form className="partner-register-form" onSubmit={handleSubmit}>
          <section className="form-section">
            <h3>Business Details</h3>

            <div className="form-group">
              <label>Business Name</label>
              <input name="businessName" required />
            </div>

            <div className="two-col">
              <div className="form-group">
                <label>Contact Name</label>
                <input name="contactName" required />
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input name="phone" required />
              </div>
            </div>
          </section>

          <section className="form-section">
            <h3>Account Credentials</h3>

            <div className="form-group">
              <label>Email</label>
              <input name="email" type="email" required />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input name="password" type="password" required />
            </div>
          </section>

          <section className="form-section">
            <h3>Location</h3>

            <div className="two-col">
              <div className="form-group">
                <label>City</label>
                <input name="city" required />
              </div>

              <div className="form-group">
                <label>State</label>
                <input name="state" required />
              </div>
            </div>

            <div className="form-group">
              <label>Pincode</label>
              <input name="pincode" required />
            </div>

            <div className="form-group">
              <label>Address</label>
              <input name="address" required />
            </div>
          </section>

          <button className="partner-register-btn" type="submit">
            Create Partner Account
          </button>
        </form>

        <footer className="partner-register-footer">
          <span>Already a partner?</span>
          <Link to="/food-partner/login">Sign in</Link>
        </footer>
      </div>
    </div>
  );
};

export default FoodPartnerRegister;
