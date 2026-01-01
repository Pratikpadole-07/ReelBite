import React, { useEffect, useState } from "react";
import api from "../../assets/api/api";
import socket from "../../socket";
import OrderStatusExplanationModal from "../../components/OrderStatusExplanationModal";
import "../../styles/orders.css";

const STATUS_FLOW = ["pending", "accepted", "preparing", "completed"];

const STATUS_LABEL = {
  pending: "Order Placed",
  accepted: "Accepted",
  preparing: "Preparing",
  completed: "Completed"
};

const formatTime = (date) =>
  new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });

const UserOrders = () => {
  const [orders, setOrders] = useState([]);

  // 🔥 AI explanation state
  const [explainOpen, setExplainOpen] = useState(false);
  const [explainLoading, setExplainLoading] = useState(false);
  const [explainText, setExplainText] = useState("");

  /* ---------------- FETCH ORDERS ---------------- */
  const fetchOrders = async () => {
    try {
      const res = await api.get("/order/my");
      setOrders(res.data.orders || []);
    } catch {
      setOrders([]);
    }
  };

  /* ---------------- INITIAL LOAD ---------------- */
  useEffect(() => {
    fetchOrders();
  }, []);

  /* ---------------- REAL-TIME UPDATES ---------------- */
  useEffect(() => {
    socket.on("order-status-updated", (data) => {
      setOrders(prev =>
        prev.map(order =>
          order._id === data.orderId
            ? {
                ...order,
                status: data.status,
                statusHistory: [
                  ...(order.statusHistory || []),
                  { status: data.status, at: data.at }
                ]
              }
            : order
        )
      );
    });

    return () => socket.off("order-status-updated");
  }, []);

  /* ---------------- AI EXPLAIN ---------------- */
  const explainStatus = async (orderId) => {
    setExplainOpen(true);
    setExplainLoading(true);
    setExplainText("");

    try {
      const res = await api.get(`/order/${orderId}/explanation`);
      setExplainText(res.data.explanation);
    } catch {
      setExplainText("Explanation unavailable at the moment.");
    } finally {
      setExplainLoading(false);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="orders-page">
      <h2>Your Orders</h2>

      {orders.length === 0 ? (
        <p className="empty-text">No orders yet</p>
      ) : (
        <div className="orders-list">
          {orders.map(order => {
            const currentIndex = STATUS_FLOW.indexOf(order.status);

            return (
              <div key={order._id} className="order-item">
                <video src={order.food.video} muted />

                <div className="order-info">
                  <h3>{order.food.name}</h3>
                  <p>Rs {order.food.price}</p>

                  {/* STATUS TIMELINE */}
                  <div className="status-timeline">
                    {STATUS_FLOW.map((status, idx) => {
                      const historyItem =
                        order.statusHistory?.find(h => h.status === status);

                      const isCompleted = idx < currentIndex;
                      const isCurrent = idx === currentIndex;

                      return (
                        <div className="timeline-row" key={status}>
                          <div
                            className={`timeline-dot ${
                              isCompleted ? "done" : ""
                            } ${isCurrent ? "current" : ""}`}
                          />

                          <div className="timeline-content">
                            <span className="timeline-label">
                              {STATUS_LABEL[status]}
                            </span>

                            {historyItem && (
                              <span className="timeline-time">
                                {formatTime(historyItem.at)}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* 🔥 AI BUTTON */}
                  <button
                    className="secondary"
                    onClick={() => explainStatus(order._id)}
                  >
                    Explain status
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 🔥 AI MODAL */}
      <OrderStatusExplanationModal
        open={explainOpen}
        loading={explainLoading}
        text={explainText}
        onClose={() => setExplainOpen(false)}
      />
    </div>
  );
};

export default UserOrders;
