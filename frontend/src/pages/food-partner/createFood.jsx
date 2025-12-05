import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "../../styles/create-food.css";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:3000/api";

const CreateFood = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [orderLink, setOrderLink] = useState("");
  const [category, setCategory] = useState("Other");
  const [foodPartner, setFoodPartner] = useState("");
  const [partners, setPartners] = useState([]);

  const [videoFile, setVideoFile] = useState(null);
  const [videoURL, setVideoURL] = useState("");

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // 🔹 Fetch Food Partners
  useEffect(() => {
    axios.get(`${API_URL}/foodpartner`, { withCredentials: true })
      .then(res => setPartners(res.data.data || []))
      .catch(err => console.error("Partners fetch err:", err));
  }, []);

  useEffect(() => {
    if (!videoFile) return setVideoURL("");
    const url = URL.createObjectURL(videoFile);
    setVideoURL(url);
    return () => URL.revokeObjectURL(url);
  }, [videoFile]);

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file.type.startsWith("video/")) return alert("Upload video only!");
    setVideoFile(file);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("orderLink", orderLink);
    formData.append("category", category);
    formData.append("foodPartner", foodPartner);
    formData.append("mama", videoFile);

    try {
      await axios.post(`${API_URL}/food`, formData, { withCredentials: true });
      navigate("/");
    } catch (err) {
      console.error("Upload Failed:", err);
    }
  };

  return (
    <div className="create-food-page">
      <div className="create-food-card">
        <h2>Create Food Reel</h2>

        <form onSubmit={onSubmit}>
          {/* Video */}
          <label>Video</label>
          <input type="file" ref={fileInputRef} onChange={onFileChange} hidden />
          <div className="file-dropzone" onClick={() => fileInputRef.current.click()}>
            Tap to upload
          </div>
          {videoURL && <video className="preview" src={videoURL} controls />}

          <label>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required />

          <label>Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />

          {/* Restaurant Dropdown */}
          <label>Restaurant</label>
          <select value={foodPartner} onChange={(e) => setFoodPartner(e.target.value)} required>
            <option value="">Select Restaurant</option>
            {partners.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name} — {p.address}
              </option>
            ))}
          </select>

          <label>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option>Pizza</option>
            <option>Burger</option>
            <option>Desserts</option>
            <option>Drinks</option>
            <option>South Indian</option>
            <option>Chinese</option>
            <option>Other</option>
          </select>

          <label>Price ₹</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />

          <label>Order Link</label>
          <input value={orderLink} onChange={(e) => setOrderLink(e.target.value)} />

          <button disabled={!name || !foodPartner || !videoFile}>Upload</button>
        </form>
      </div>
    </div>
  );
};

export default CreateFood;
