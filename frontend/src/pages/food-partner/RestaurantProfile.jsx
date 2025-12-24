import React, { useState, useEffect, useContext } from "react";
import "../../styles/restaurant.css";
import api from "../../assets/api/api";
import { AuthContext } from "../../context/AuthContext";
import ReelFeed from "../../components/ReelFeed";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const RestaurantProfileSelf = () => {
  const { foodPartner, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [myFoods, setMyFoods] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [trends, setTrends] = useState([]);

  /* ---------------- FETCHES ---------------- */

  const fetchMyUploads = async () => {
    const res = await api.get("/food/my-uploads");
    setMyFoods(res.data.foods || []);
  };

  const fetchAnalytics = async () => {
    const res = await api.get("/order/partner/analytics");
    setAnalytics(res.data);
  };

  const fetchTrends = async () => {
    try {
      const res = await api.get("/food/analytics/trends");
      setTrends(
        res.data.map(item => ({
          date: `${item._id.day}/${item._id.month}`,
          orders: item.orders
        }))
      );
    } catch {
      setTrends([]);
    }
  };

  useEffect(() => {
    if (foodPartner) {
      fetchMyUploads();
      fetchAnalytics();
      fetchTrends();
    }
  }, [foodPartner]);

  if (loading || !foodPartner) return <h3>Loading...</h3>;

  /* ---------------- UI ---------------- */

  return (
    <main className="restaurant-page">
      {/* HEADER */}
      <header className="restaurant-header">
        <img
          src={foodPartner.logo || "https://placehold.co/100x100"}
          className="restaurant-avatar"
          alt="logo"
        />

        <div className="restaurant-details">
          <h2>{foodPartner.name}</h2>
          <p>{foodPartner.address}</p>
          <p>📞 {foodPartner.phone}</p>
        </div>

        <button onClick={() => navigate("/food-partner/create-food")}>
          ➕ Add Reel
        </button>
        <button onClick={() => navigate("/food-partner/edit")}>
          ✏️ Edit Profile
        </button>
      </header>

      {/* ================= ANALYTICS ================= */}
      <h3 style={{ marginTop: 30, color: "#fff" }}>Insights</h3>

      <div
        style={{
          background: "#111",
          padding: 20,
          borderRadius: 12,
          width: "85%",
          margin: "20px auto",
          display: "flex",
          justifyContent: "space-around",
          color: "#fff"
        }}
      >
        <div>
          <h4>Total Orders</h4>
          <p style={{ fontSize: 26 }}>
            {analytics ? analytics.totalOrders : 0}
          </p>
        </div>

        <div>
          <h4>Total Revenue</h4>
          <p style={{ fontSize: 26 }}>
            Rs.{analytics ? analytics.totalRevenue : 0}
          </p>
        </div>
      </div>

      {/* ================= TREND CHART ================= */}
      {trends.length > 0 && (
        <div
          style={{
            background: "#111",
            padding: 20,
            borderRadius: 12,
            width: "85%",
            margin: "20px auto"
          }}
        >
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={trends}>
              <XAxis dataKey="date" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="#8884d8"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* ================= UPLOADS ================= */}
      <h3 style={{ color: "#fff", marginTop: 30 }}>Your Uploads</h3>
      <ReelFeed items={myFoods} />
    </main>
  );
};

export default RestaurantProfileSelf;
