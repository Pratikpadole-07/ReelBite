import React, { useState, useContext } from "react";
import api from "../../assets/api/api";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/edit-restaurant.css";

const EditRestaurant = () => {
  const { foodPartner, setFoodPartner } = useContext(AuthContext);
  const [form, setForm] = useState({ ...foodPartner });
  const [logo, setLogo] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (typeof value !== "object") fd.append(key, value);
    });

    fd.append("zomato", form.orderLinks?.zomato || "");
    fd.append("swiggy", form.orderLinks?.swiggy || "");
    fd.append("website", form.orderLinks?.website || "");

    if (logo) fd.append("logo", logo);

    const res = await api.put("/auth/food-partner/update", fd);
    setFoodPartner(res.data.partner);
    alert("Updated Successfully!");
  };

  return (
    <div className="edit-restaurant-container">
      <div className="edit-card">
        <h2>✨ Edit Restaurant Profile</h2>

        <form onSubmit={handleSubmit}>
          <div className="input-grid">
            <label>Restaurant Name</label>
            <input name="name" value={form.name} onChange={handleChange} required />

            <label>Phone</label>
            <input name="phone" value={form.phone} onChange={handleChange} required />

            <label>City</label>
            <input name="city" value={form.city} onChange={handleChange} required />

            <label>State</label>
            <input name="state" value={form.state} onChange={handleChange} required />

            <label>Pincode</label>
            <input name="pincode" value={form.pincode} onChange={handleChange} required />

            <label>Address</label>
            <textarea name="address" value={form.address} onChange={handleChange} required />

            <label>Zomato Link</label>
            <input
              name="zomato"
              value={form.orderLinks?.zomato || ""}
              onChange={handleChange}
            />

            <label>Swiggy Link</label>
            <input
              name="swiggy"
              value={form.orderLinks?.swiggy || ""}
              onChange={handleChange}
            />

            <label>Website Link</label>
            <input
              name="website"
              value={form.orderLinks?.website || ""}
              onChange={handleChange}
            />

            <label>Restaurant Logo</label>
            <input type="file" onChange={(e) => setLogo(e.target.files[0])} />
          </div>

          <button className="save-btn">Save Changes ✅</button>
        </form>
      </div>
    </div>
  );
};

export default EditRestaurant;
