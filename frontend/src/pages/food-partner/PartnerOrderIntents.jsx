import React, { useEffect, useState } from "react";
import api from "../../assets/api/api";
import "../../styles/orders.css";

const PartnerOrderIntents = () => {
  const [intents, setIntents] = useState([]);

  const fetchIntents = async () => {
    try {
      const res = await api.get("/order-intent/partner", {
        withCredentials: true,
      });
      setIntents(res.data.intents || []);
    } catch (err) {
      console.error("Fetch intents failed", err);
      setIntents([]);
    }
  };

  useEffect(() => {
    fetchIntents();
  }, []);

  return (
    <div className="orders-page">
      <h2>Order Intents</h2>

      {intents.length === 0 ? (
        <p className="empty-text">No order intent activity yet</p>
      ) : (
        <table className="orders-table">
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
                <td>{i.method.toUpperCase()}</td>
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

export default PartnerOrderIntents;
