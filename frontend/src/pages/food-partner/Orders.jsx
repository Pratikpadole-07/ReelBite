import React, { useEffect, useRef, useState, useContext } from "react";
import api from "../../assets/api/api";
import "../../styles/orders.css";
import { AuthContext } from "../../context/AuthContext";

const STEPS = ["pending", "accepted", "preparing", "completed"];

const formatTime = date =>
  new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });

// strict linear transition
const canMoveTo = (current, next) => {
  const ci = STEPS.indexOf(current);
  const ni = STEPS.indexOf(next);
  return ni === ci + 1;
};

const PartnerOrders = () => {
  const { loading, foodPartner } = useContext(AuthContext);

  const [orders, setOrders] = useState([]);
  const [updatingId, setUpdatingId] = useState(null);
  const snapshotRef = useRef([]);

  // 🚫 DO NOTHING until auth is stable
  useEffect(() => {
    if (!loading && foodPartner) {
      fetchOrders();
    }
  }, [loading, foodPartner]);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/order/partner");
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error("Failed to load orders", err);
      setOrders([]);
    }
  };

  const updateStatus = async (orderId, nextStatus) => {
    if (loading) return; // 🔒 critical
    if (!foodPartner) return;

    const order = orders.find(o => o._id === orderId);
    if (!order) return;

    if (!canMoveTo(order.status, nextStatus)) return;
    if (updatingId === orderId) return;

    // deep snapshot for rollback
    snapshotRef.current = JSON.parse(JSON.stringify(orders));
    setUpdatingId(orderId);

    // optimistic UI
    setOrders(prev =>
      prev.map(o =>
        o._id === orderId
          ? {
              ...o,
              status: nextStatus,
              statusHistory: [
                ...(o.statusHistory || []),
                { status: nextStatus, at: new Date() }
              ]
            }
          : o
      )
    );

    try {
      const res = await api.patch("/order/status", {
        orderId,
        status: nextStatus
      });

      // idempotent no-op
      if (res.data?.message === "No state change") return;
    } catch (err) {
      console.error("Rollback", err);
      setOrders(snapshotRef.current);
      alert("Failed to update order status");
    } finally {
      setUpdatingId(null);
    }
  };

  // while auth is resolving, render nothing
  if (loading) return null;

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
              <span className="current-status">
                {order.status.toUpperCase()}
              </span>
            </div>

            {/* STATUS STEPPER */}
            <div className="stepper">
              {STEPS.map((step, idx) => {
                const history = order.statusHistory?.find(
                  h => h.status === step
                );
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
                      <span className="time">
                        {formatTime(history.at)}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* ACTIONS */}
            <div className="actions">
              {order.status === "pending" && (
                <button
                  disabled={updatingId === order._id}
                  onClick={() => updateStatus(order._id, "accepted")}
                >
                  Accept
                </button>
              )}

              {order.status === "accepted" && (
                <button
                  disabled={updatingId === order._id}
                  onClick={() => updateStatus(order._id, "preparing")}
                >
                  Start Preparing
                </button>
              )}

              {order.status === "preparing" && (
                <button
                  disabled={updatingId === order._id}
                  onClick={() => updateStatus(order._id, "completed")}
                >
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
