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

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const limit = 10;

  const fetchData = async () => {
    try {
      setLoading(true);

      const [intentRes, analyticsRes] = await Promise.all([
        api.get(
          `/order-intent/partner?page=${page}&limit=${limit}`,
          { withCredentials: true }
        ),
        api.get(
          "/order-intent/analytics",
          { withCredentials: true }
        )
      ]);

      setIntents(intentRes.data.intents || []);
      setPage(intentRes.data.page || 1);
      setTotalPages(intentRes.data.totalPages || 1);
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
  }, [page]);

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
        <>
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
                  <td className={`method ${i.method}`}>
                    {i.method.toUpperCase()}
                  </td>
                  <td>{i.user}</td>
                  <td>{new Date(i.time).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* PAGINATION */}
          <div className="pagination">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
            >
              Prev
            </button>

            <span>
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default OrderIntentDashboard;
