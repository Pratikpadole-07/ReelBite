import React, { useState, useEffect, useContext } from "react";
import "../../styles/restaurant.css";
import { useNavigate } from "react-router-dom";
import api from "../../assets/api/api";
import ReelFeed from "../../components/ReelFeed";
import { AuthContext } from "../../context/AuthContext";

const FoodPartnerPage = () => {
  const navigate = useNavigate();
  const { foodPartner, loading } = useContext(AuthContext);

  const [partner, setPartner] = useState(null);
  const [myFoods, setMyFoods] = useState([]);

  useEffect(() => {
    if (!foodPartner) return;
    fetchPartner();
    fetchMyFoods();
  }, [foodPartner]);

  const fetchPartner = async () => {
    try {
      const res = await api.get("/auth/food-partner/me");
      setPartner(res.data.foodPartner);
    } catch (err) {
      console.error("Error loading partner:", err);
    }
  };

  const fetchMyFoods = async () => {
    try {
      const res = await api.get("/food/my-uploads");
      setMyFoods(res.data.foods || []);
    } catch (err) {
      console.error("Fetch uploads error:", err);
    }
  };

  if (loading || !partner) return <h3>Loading...</h3>;

  return (
    <main className="restaurant-page">
      
      {/* HEADER SECTION */}
      <header className="restaurant-header">
        <img
          className="restaurant-avatar"
          src="https://placehold.co/100x100"
          alt="restaurant"
        />

        <div className="restaurant-details">
          <h2>{partner.name}</h2>
          <p>{partner.address}</p>
          <p>📞 {partner.phone}</p>
        </div>

        <button
          className="my-upload-btn"
          onClick={() => navigate("/food-partner/create-food")}
        >
          ➕ Add New Reel
        </button>
      </header>

      {/* REELS SECTION */}
      <h3 style={{ marginTop: 20 }}>Your Uploaded Reels 🍽️</h3>

      {myFoods.length === 0 ? (
        <p style={{ color: "#999" }}>No uploads yet 😕</p>
      ) : (
        <ReelFeed items={myFoods} />
      )}

    </main>
  );
};

export default FoodPartnerPage;
