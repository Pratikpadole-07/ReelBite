import React, { useEffect, useState } from "react";
import api from "../../assets/api/api";
import "../../styles/order-intent.css";

const OrderIntentDashboard = () => {
  const [intents, setIntents] = useState([]);
  const [analytics, setAnalytics] = useState({
    zomato: 0,
    swiggy: 0,
    call: 0,
    inquiry: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [intentRes, analyticsRes] = await Promise.all([
        api.get("/order-intent/partner", { withCredentials: true }),
        api.get("/order-intent/analytics", { withCredentials: true })
      ]);

      setIntents(intentRes.data.intents || []);
      setAnalytics(analyticsRes.data.analytics || {});
    } catch (err) {
      console.error("OrderIntent fetch error", err);
      setIntents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <div className="order-intent-page">Loading...</div>;
  }

  return (
    <div className="order-intent-page">
      <h2>Order Intent Dashboard</h2>

      {/* ANALYTICS */}
      <div className="intent-stats">
        <div className="stat-card">Zomato<br /><b>{analytics.zomato}</b></div>
        <div className="stat-card">Swiggy<br /><b>{analytics.swiggy}</b></div>
        <div className="stat-card">Call<br /><b>{analytics.call}</b></div>
        <div className="stat-card">Inquiry<br /><b>{analytics.inquiry}</b></div>
      </div>

      {/* TABLE */}
      {intents.length === 0 ? (
        <p className="empty-text">No order intents yet</p>
      ) : (
        <table className="intent-table">
          <thead>
            <tr>
              <th>Food</th>
              <th>Method</th>
              <th>User</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {intents.map(i => (
              <tr key={i.id}>
                <td>{i.foodName}</td>
                <td className={`method ${i.method}`}>{i.method.toUpperCase()}</td>
                <td>{i.user}</td>
                <td>{new Date(i.time).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderIntentDashboard;
