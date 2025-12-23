import React, { useEffect, useState } from "react";
import api from "../../assets/api/api";
import "../../styles/orders.css";

const PartnerOrders = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/order/partner");
      setOrders(res.data.orders || []);
    } catch {
      setOrders([]);
    }
  };

  const updateStatus = async (orderId, status) => {
    await api.patch("/order/status", { orderId, status });
    setOrders(prev =>
      prev.map(o =>
        o._id === orderId ? { ...o, status } : o
      )
    );
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="orders-page">
      <h2>Incoming Orders</h2>

      {orders.length === 0 ? (
        <p className="empty-text">No orders from customers</p>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Food</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.map(o => (
              <tr key={o._id}>
                <td>{o.food.name}</td>
                <td>{o.user.name}</td>
                <td>{o.status.toUpperCase()}</td>
                <td>

                  {/* PENDING */}
                  {o.status === "pending" && (
                    <>
                      <button
                        className="green"
                        onClick={() => updateStatus(o._id, "accepted")}
                      >
                        Accept
                      </button>
                      <button
                        className="red"
                        onClick={() => updateStatus(o._id, "rejected")}
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {/* ACCEPTED */}
                  {o.status === "accepted" && (
                    <button
                      className="orange"
                      onClick={() => updateStatus(o._id, "preparing")}
                    >
                      Start Preparing
                    </button>
                  )}

                  {/* PREPARING */}
                  {o.status === "preparing" && (
                    <button
                      className="green"
                      onClick={() => updateStatus(o._id, "completed")}
                    >
                      Mark Completed
                    </button>
                  )}

                  {/* COMPLETED / REJECTED */}
                  {(o.status === "completed" || o.status === "rejected") && (
                    <span className="status-done">No actions</span>
                  )}

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PartnerOrders;
