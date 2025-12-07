// RestaurantProfilePublic.jsx
import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import "../../styles/restaurant.css";
import api from "../../assets/api/api";
import ReelFeed from "../../components/ReelFeed";
import { AuthContext } from "../../context/AuthContext";

const RestaurantProfilePublic = () => {
  const { id } = useParams();
  const { user, foodPartner } = useContext(AuthContext);

  const [partner, setPartner] = useState(null);
  const [foods, setFoods] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id, user]);

  const fetchData = async () => {
    try {
      const partnerRes = await api.get(`/food/partner/${id}`);
      setPartner(partnerRes.data.partner);
      setFoods(partnerRes.data.foods);

      if (user) {
        const followRes = await api.get(`/auth/user/me`);
        const followingList = followRes.data.user.following || [];
        setIsFollowing(followingList.includes(id));
      }
    } catch (err) {
      console.log("Error loading partner page:", err);
    }
  };

  const toggleFollow = async () => {
    try {
      const url = isFollowing ? "/unfollow" : "/follow";
      await api.post(url, { partnerId: id });
      setIsFollowing(!isFollowing);
    } catch (err) {
      console.log("Follow error:", err);
    }
  };

  if (!partner) return <h3>Loading...</h3>;

  const isSelf = foodPartner && foodPartner._id === id;

  return (
    <main className="restaurant-page">

      {/* HEADER */}
      <header className="restaurant-header">
        <img
          src={partner.logo || "https://placehold.co/100x100"}
          className="restaurant-avatar"
          alt="restaurant"
        />

        <div className="restaurant-details">
          <h2>{partner.name}</h2>
          <p>{partner.address}</p>
          <p>📞 {partner.phone}</p>
        </div>

        {!isSelf && user && (
          <button className="follow-btn" onClick={toggleFollow}>
            {isFollowing ? "Following" : "Follow"}
          </button>
        )}
      </header>

      {/* FOODS */}
      <h3>{isSelf ? "Your Uploads" : "Food Reels"}</h3>

      {foods.length === 0 ? (
        <p className="empty-text">No reels yet</p>
      ) : (
        <ReelFeed items={foods} />
      )}
    </main>
  );
};

export default RestaurantProfilePublic;
