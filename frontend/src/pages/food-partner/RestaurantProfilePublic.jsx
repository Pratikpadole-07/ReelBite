// RestaurantProfilePublic.jsx
import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id, user]);

  const fetchData = async () => {
    try {
      const res = await api.get(`/food/partner/${id}`);

      // ✅ correct keys
      setPartner(res.data.foodPartner);
      setFoods(res.data.foods || []);

      // ✅ use AuthContext user directly
      if (user?.following) {
        setIsFollowing(user.following.includes(id));
      }
    } catch (err) {
      console.error("Error loading partner page:", err);
    } finally {
      // 🔥 always end loading
      setLoading(false);
    }
  };

  const toggleFollow = async () => {
    try {
      const url = isFollowing ? "/food/unfollow" : "/food/follow";
      await api.post(url, { partnerId: id });
      setIsFollowing(!isFollowing);
    } catch (err) {
      console.error("Follow error:", err);
    }
  };

  if (loading) {
    return <h3 style={{ padding: 20 }}>Loading...</h3>;
  }

  if (!partner) {
    return <h3 style={{ padding: 20 }}>Restaurant not found</h3>;
  }

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
