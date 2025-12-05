import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import "../../styles/profile.css";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:3000/api";

const UserProfile = () => {
  const { user, logout } = useContext(AuthContext);
  const [savedVideos, setSavedVideos] = useState([]);
  const [uploadedVideos, setUploadedVideos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    // Get saved foods
    axios
      .get(`${API_URL}/food/save`, { withCredentials: true })
      .then((res) => setSavedVideos(res.data.savedFoods.map((s) => s.food)))
      .catch(() => setSavedVideos([]));

    // Get uploaded foods by this user (foodPartner only)
    axios
      .get(`${API_URL}/food?myUploads=true`, { withCredentials: true })
      .then((res) => setUploadedVideos(res.data.foodItems || []))
      .catch(() => setUploadedVideos([]));

  }, [user]);

  if (!user) return <p className="loading">Loading user...</p>;

  const handleAvatarUpload = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      await axios.post(
        `${API_URL}/auth/user/avatar`,
        formData,
        { withCredentials: true }
      );
      window.location.reload();
    } catch {
      alert("Avatar upload failed!");
    }
  };

  return (
    <div className="profile-page">

      {/* Profile Header */}
      <div className="profile-header">
        <label className="avatar-upload">
          <img
            className="profile-avatar"
            src={user.avatar}
            alt="avatar"
          />
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => handleAvatarUpload(e.target.files[0])}
          />
        </label>

        <div className="info">
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </div>

        <button className="logout-btn" onClick={logout}>Logout</button>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-box">
          <p className="number">{uploadedVideos.length}</p>
          <p>Uploaded</p>
        </div>

        <div className="stat-box">
          <p className="number">{savedVideos.length}</p>
          <p>Saved</p>
        </div>

        <Link className="edit-btn" to="/saved">View Saved →</Link>
      </div>

      {/* Profile Grid - Uploaded First */}
      <h3 className="section-title">Your Reels</h3>
      <div className="grid-container">
        {uploadedVideos.length === 0 ? (
          <p className="empty-text">No Uploads Yet</p>
        ) : (
          uploadedVideos.map((v) => (
            <div key={v._id} className="grid-item">
              <video src={v.video} muted />
            </div>
          ))
        )}
      </div>

      {/* Saved Grid */}
      <h3 className="section-title">Saved Reels</h3>
      <div className="grid-container">
        {savedVideos.length === 0 ? (
          <p className="empty-text">No Saved Reels</p>
        ) : (
          savedVideos.map((v) => (
            <div key={v._id} className="grid-item">
              <video src={v.video} muted />
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default UserProfile;
