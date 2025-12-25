import React, { useEffect, useState } from "react";
import api from "../../assets/api/api";
import "../../styles/orders.css";

const STEPS = ["pending", "accepted", "preparing", "completed"];

const formatTime = (date) =>
  new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });

const PartnerOrders = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const res = await api.get("/order/partner");
    setOrders(res.data.orders || []);
  };

  const updateStatus = async (orderId, status) => {
    await api.patch("/order/status", { orderId, status });
    setOrders(prev =>
      prev.map(o =>
        o._id === orderId
          ? {
              ...o,
              status,
              statusHistory: [...o.statusHistory, { status, at: new Date() }]
            }
          : o
      )
    );
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="orders-page">
      <h2>Incoming Orders</h2>

      {orders.map(order => {
        const currentIndex = STEPS.indexOf(order.status);

        return (
          <div key={order._id} className="order-card">
            <div className="order-header">
              <div>
                <h4>{order.food.name}</h4>
                <p className="muted">Customer: {order.user.name}</p>
              </div>
              <span className="current-status">{order.status.toUpperCase()}</span>
            </div>

            <div className="stepper">
              {STEPS.map((step, idx) => {
                const history = order.statusHistory?.find(h => h.status === step);
                const isDone = idx < currentIndex;
                const isActive = idx === currentIndex;

                return (
                  <div key={step} className="step">
                    <div
                      className={`dot ${
                        isDone ? "done" : isActive ? "active" : "future"
                      }`}
                    />
                    <span className="label">{step}</span>
                    {history && (
                      <span className="time">{formatTime(history.at)}</span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="actions">
              {order.status === "pending" && (
                <>
                  <button onClick={() => updateStatus(order._id, "accepted")}>
                    Accept
                  </button>
                  <button className="danger" onClick={() => updateStatus(order._id, "rejected")}>
                    Reject
                  </button>
                </>
              )}

              {order.status === "accepted" && (
                <button onClick={() => updateStatus(order._id, "preparing")}>
                  Start Preparing
                </button>
              )}

              {order.status === "preparing" && (
                <button onClick={() => updateStatus(order._id, "completed")}>
                  Mark Completed
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PartnerOrders;
