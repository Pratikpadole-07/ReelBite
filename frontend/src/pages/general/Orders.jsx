import React, { useEffect, useState } from "react";
import api from "../../assets/api/api";
import "../../styles/orders.css";

const statusColor = {
  pending: "#9e9e9e",
  accepted: "#2196f3",
  preparing: "#ff9800",
  completed: "#4caf50",
  rejected: "#f44336"
};

const UserOrders = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/order/my");
      setOrders(res.data.orders || []);
    } catch {
      setOrders([]);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="orders-page">
      <h2>Your Orders</h2>

      {orders.length === 0 ? (
        <p className="empty-text">No orders yet</p>
      ) : (
        <div className="orders-list">
          {orders.map(o => (
            <div key={o._id} className="order-item">
              <video src={o.food.video} muted />
              <div className="order-info">
                <h3>{o.food.name}</h3>
                <p>₹ {o.food.price}</p>
                <span
                  className="status"
                  style={{ backgroundColor: statusColor[o.status] }}
                >
                  {o.status.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserOrders;
