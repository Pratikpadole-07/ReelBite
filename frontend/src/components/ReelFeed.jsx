import React, { useEffect, useRef, useState, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../assets/api/api";
import CommentModal from "./CommentModal";
import { AuthContext } from "../context/AuthContext";

const ReelFeed = ({
  items = [],
  onLike,
  onSave,
  emptyMessage = "No reels.",
  isLoading = false
}) => {
  const { user } = useContext(AuthContext);

  const [activeCommentFoodId, setActiveCommentFoodId] = useState(null);
  const [placingOrderId, setPlacingOrderId] = useState(null);

  const videoRefs = useRef(new Map());

  /* ---------------- VIDEO AUTOPLAY ---------------- */
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const video = entry.target;
          if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.6 }
    );

    videoRefs.current.forEach(video => observer.observe(video));
    return () => observer.disconnect();
  }, [items]);

  const registerVideoRef = id => el => {
    if (!el) videoRefs.current.delete(id);
    else videoRefs.current.set(id, el);
  };

  /* ---------------- PLACE ORDER ---------------- */
  const placeOrder = async (foodId) => {
    try {
      setPlacingOrderId(foodId);
      await api.post("/order", { foodId });
      alert("Order placed successfully");
    } catch (err) {
      console.error(err.response?.data || err);
      alert(err.response?.data?.message || "Failed to place order");
    } finally {
      setPlacingOrderId(null);
    }
  };

  /* ---------------- STATES ---------------- */
  if (isLoading) {
    return <div className="reel-page">Loading reels...</div>;
  }

  if (!items.length) {
    return <div className="reel-page">{emptyMessage}</div>;
  }

  /* ---------------- RENDER ---------------- */
  return (
    <div className="reel-page">
      {items.map(item => {
        const partner = item.foodPartner || {};

        return (
          <div key={item._id} className="reel-row">
            <div className="reel-box">
              <video
                ref={registerVideoRef(item._id)}
                src={item.video}
                muted
                loop
                playsInline
                className="reel-video"
              />
            </div>

            <div className="right-panel">
              <div className="action-group">
                <button onClick={() => onLike(item)}>❤️</button>
                <span>{item.likeCount || 0}</span>

                <button onClick={() => onSave(item)}>🔖</button>
                <span>{item.savesCount || 0}</span>

                <button onClick={() => setActiveCommentFoodId(item._id)}>💬</button>
                <span>{item.commentsCount || 0}</span>
              </div>

              <div className="food-info">
                <h3>{item.name}</h3>
                {item.description && <p>{item.description}</p>}
                {item.price && <p>Rs. {item.price}</p>}

                {/* PUBLIC RESTAURANT PROFILE */}
                {partner._id && (
                  <Link
                    to={`/restaurant/${partner._id}`}
                    className="partner-link"
                  >
                    <img
                      src={partner.logo || "https://placehold.co/40x40"}
                      alt="partner"
                      className="partner-mini-logo"
                    />
                    <span>{partner.name}</span>
                  </Link>
                )}

                {/* USER ONLY */}
                {user && (
                  <button
                    className="order-btn"
                    disabled={placingOrderId === item._id}
                    onClick={() => placeOrder(item._id)}
                  >
                    {placingOrderId === item._id ? "Placing..." : "Order Now"}
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}

      <CommentModal
        foodId={activeCommentFoodId}
        isOpen={!!activeCommentFoodId}
        onClose={() => setActiveCommentFoodId(null)}
      />
    </div>
  );
};

export default ReelFeed;
