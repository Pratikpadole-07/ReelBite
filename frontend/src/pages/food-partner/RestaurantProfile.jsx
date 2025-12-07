// RestaurantProfileSelf.jsx
import React, { useState, useEffect, useContext } from "react";
import "../../styles/restaurant.css";
import api from "../../assets/api/api";
import { AuthContext } from "../../context/AuthContext";
import ReelFeed from "../../components/ReelFeed";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";

const RestaurantProfileSelf = () => {
  const { foodPartner, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [myFoods, setMyFoods] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [trends, setTrends] = useState([]);

  const fetchMyUploads = async () => {
    try {
      const res = await api.get("/food/my-uploads");
      setMyFoods(res.data.foods || []);
    } catch (err) {
      console.error("Err fetching uploads:", err);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await api.get("/order/analytics", { withCredentials: true });
      setAnalytics(res.data.data || []);
    } catch (err) {
      console.error("Analytics fetch error:", err);
    }
  };

  const fetchTrends = async () => {
    try {
      const res = await api.get("/order/analytics/trends", { withCredentials: true });
      setTrends(
        (res.data.data || []).map((item) => ({
          date: item._id,
          orders: item.count
        }))
      );
    } catch (err) {
      console.error("Trend fetch error:", err);
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

  return (
    <main className="restaurant-page">
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

        <button onClick={() => navigate("/food-partner/create-food")}>➕ Add Reel</button>
        <button onClick={() => navigate("/food-partner/edit")}>✏️ Edit Profile</button>
      </header>

      {/* Analytics Section */}
      {(analytics.length > 0 || trends.length > 0) && (
        <>
          <h3 style={{ marginTop: 30, color: "#fff" }}>Insights</h3>

          {/* Pie Chart */}
          {analytics.length > 0 && (
            <div style={{
              background: "#111",
              padding: 20,
              borderRadius: 12,
              width: "85%",
              display: "flex",
              justifyContent: "center",
              margin: "20px auto"
            }}>
              <ResponsiveContainer width={350} height={280}>
                <PieChart>
                  <Pie
                    data={analytics.map(a => ({ name: a._id, value: a.count }))}
                    dataKey="value"
                    innerRadius={50}
                    outerRadius={100}
                    label
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Trend Line Chart */}
          {trends.length > 0 && (
            <div style={{
              background: "#111",
              padding: 20,
              borderRadius: 12,
              width: "85%",
              display: "flex",
              justifyContent: "center",
              margin: "20px auto"
            }}>
              <ResponsiveContainer width={350} height={280}>
                <LineChart data={trends}>
                  <XAxis dataKey="date" stroke="#ccc" />
                  <YAxis stroke="#ccc" />
                  <Tooltip />
                  <Line type="monotone" dataKey="orders" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}

      {/* Uploads Section */}
      <h3 style={{ color: "#fff", marginTop: 30 }}>Your Uploads</h3>
      <ReelFeed items={myFoods} />
    </main>
  );
};

export default RestaurantProfileSelf;
