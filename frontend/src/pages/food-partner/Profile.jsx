import React, { useState, useEffect } from "react";
import "../../styles/restaurant.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import ReelFeed from "../../components/ReelFeed";

const API_URL = "http://localhost:3000/api";

const FoodPartnerPage = () => {
  const { id } = useParams();
  const [partner, setPartner] = useState(null);
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    fetchPartner();
  }, [id]);

  const fetchPartner = async () => {
    try {
      const res = await axios.get(`${API_URL}/food/partner/${id}`, {
        withCredentials: true,
      });

      setPartner(res.data.partner);
      setFoods(res.data.foods);
    } catch (err) {
      console.error("Error loading partner:", err);
    }
  };

  if (!partner) return <h3>Loading...</h3>;

  return (
    <main className="restaurant-page">
      <header className="restaurant-header">
        <img
          className="restaurant-avatar"
          src="https://placehold.co/100x100"
          alt="restaurant"
        />

        <h2>{partner.name}</h2>
        <p>{partner.address}</p>
        <p>📞 {partner.phone}</p>

        {/* ⭐ Order Now Buttons */}
        <div className="order-links">
          {partner?.orderLinks?.zomato && (
            <a
              href={partner.orderLinks.zomato}
              target="_blank"
              rel="noopener noreferrer"
              className="order-btn zomato"
            >
              Order on Zomato 🛵
            </a>
          )}

          {partner?.orderLinks?.swiggy && (
            <a
              href={partner.orderLinks.swiggy}
              target="_blank"
              rel="noopener noreferrer"
              className="order-btn swiggy"
            >
              Order on Swiggy 🚀
            </a>
          )}
        </div>
      </header>

      <h3 style={{ marginTop: 20 }}>Popular Reels 🍽️</h3>

      <ReelFeed items={foods} emptyMessage="No food items yet 😕" />
    </main>
  );
};

export default FoodPartnerPage;
