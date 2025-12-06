import React, { useEffect, useRef, useState, useContext } from "react";
import axios from "axios";
import "../../styles/create-food.css";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:3000/api";

const CreateFood = () => {
  const { foodPartner } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [orderLink, setOrderLink] = useState("");
  const [category, setCategory] = useState("Other");

  const [videoFile, setVideoFile] = useState(null);
  const [videoURL, setVideoURL] = useState("");

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!videoFile) return setVideoURL("");
    const url = URL.createObjectURL(videoFile);
    setVideoURL(url);
    return () => URL.revokeObjectURL(url);
  }, [videoFile]);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!foodPartner)
      return alert("Login as restaurant first!");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("orderLink", orderLink);
    formData.append("category", category);
    formData.append("foodPartner", foodPartner._id);
    formData.append("file", videoFile); // 🔥 Correct field name for backend

    try {
      const res = await axios.post(
        `${API_URL}/food/create`,
        formData,
        { withCredentials: true }
      );

      alert("Uploaded Successfully!");
      navigate(`/food-partner/my-uploads`); // 🔥 Correct redirect
    } catch (err) {
      console.error("Upload error:", err.response?.data || err);
      alert("Upload failed!");
    }
  };

  return (
    <div className="create-food-page">
      <div className="create-food-card">
        <h2>Add Food Reel</h2>

        <form onSubmit={onSubmit}>
          <label>Video</label>
          <input
            hidden
            type="file"
            ref={fileInputRef}
            accept="video/*"
            onChange={(e) => setVideoFile(e.target.files[0])}
          />

          <div
            className="file-dropzone"
            onClick={() => fileInputRef.current.click()}
          >
            Tap to upload reel
          </div>

          {videoURL && (
            <video className="preview" src={videoURL} controls />
          )}

          <label>Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <label>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>Pizza</option>
            <option>Burger</option>
            <option>Desserts</option>
            <option>Drinks</option>
            <option>South Indian</option>
            <option>Chinese</option>
            <option>Other</option>
          </select>

          <label>Price ₹</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <label>Order Link</label>
          <input
            value={orderLink}
            onChange={(e) => setOrderLink(e.target.value)}
          />

          <button disabled={!name || !videoFile}>Upload</button>
        </form>
      </div>
    </div>
  );
};

export default CreateFood;
