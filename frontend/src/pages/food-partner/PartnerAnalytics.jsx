import React, { useEffect, useState } from "react";
import api from "../../assets/api/api";

const PartnerAnalytics = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    api
      .get("/order-intent/analytics", { withCredentials: true })
      .then(res => setData(res.data.analytics))
      .catch(() => setData(null));
  }, []);

  if (!data) return <p>Loading analytics...</p>;

  return (
    <div className="analytics-card">
      <h2>Order Method Analytics</h2>

      <ul>
        <li>🍽 Zomato: {data.zomato}</li>
        <li>🛵 Swiggy: {data.swiggy}</li>
        <li>📞 Call: {data.call}</li>
        <li>❓ Inquiry: {data.inquiry}</li>
      </ul>
    </div>
  );
};

export default PartnerAnalytics;
