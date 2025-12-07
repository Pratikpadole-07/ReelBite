import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import "../../styles/profile.css";

const API_URL = "http://localhost:3000/api";

const UserProfile = () => {
  const { user, logout } = useContext(AuthContext);

  const [saved, setSaved] = useState([]);
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    if (!user) return;
    loadSaved();
    loadFollowing();
  }, [user]);

  const loadSaved = async () => {
    const res = await axios.get(`${API_URL}/food/saved`, { withCredentials: true });
    setSaved(res.data.savedFoods.map(s => s.food));
  };

  const loadFollowing = async () => {
    const res = await axios.get(`${API_URL}/follow/list`, { withCredentials: true });
    setFollowing(res.data.following);
  };

  const handleAvatarUpload = async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      await axios.post(`${API_URL}/auth/user/avatar`, formData, { withCredentials: true });
      window.location.reload();
    } catch {
      alert("Avatar upload failed");
    }
  };

  if (!user) return <p className="loading">Loading...</p>;

  return (
    <div className="profile-page">

      <div className="profile-header">
        <label className="avatar-upload">
          <img className="profile-avatar" src={user.avatar} alt="avatar" />
          <input type="file" accept="image/*" hidden
            onChange={(e) => handleAvatarUpload(e.target.files[0])} />
        </label>

        <h2>{user.name}</h2>
        <p>{user.email}</p>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </div>


      <h3 className="section-title">Saved Reels</h3>
      <div className="grid-container">
        {saved.length === 0 ? <p className="empty-text">No saved reels</p> :
          saved.map((v) => (
            <div key={v._id} className="grid-item">
              <video src={v.video} muted loop />
            </div>
          ))}
      </div>


      <h3 className="section-title">Following</h3>
      <div className="following-list">
        {following.length === 0 ? <p className="empty-text">Not following anyone</p> :
          following.map((p) => (
            <div key={p._id} className="follow-card">
              <img src={p.logo} alt="logo" />
              <span>{p.name}</span>
            </div>
          ))}
      </div>

    </div>
  );
};

export default UserProfile;
