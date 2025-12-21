import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import api from "../assets/api/api";
import CommentModal from "./CommentModal";
import OrderModal from "./OrderModal";

const ReelFeed = ({
  items = [],
  onLike,
  onSave,
  emptyMessage = "No reels.",
  isLoading = false,
}) => {
  const [activeCommentFoodId, setActiveCommentFoodId] = useState(null);
  const [orderFood, setOrderFood] = useState(null);

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
    if (!el) {
      videoRefs.current.delete(id);
    } else {
      videoRefs.current.set(id, el);
    }
  };
const getOrderMethods = (food) => {
  const partner = food.foodPartner || {};
  const links = partner.orderLinks || {};

  return [
    links.zomato && {
      label: "Zomato",
      method: "zomato",
      url: links.zomato,
    },
    links.swiggy && {
      label: "Swiggy",
      method: "swiggy",
      url: links.swiggy,
    },
    links.website && {
      label: "Website",
      method: "website",
      url: links.website,
    },
    partner.phone && {
      label: "Call Now",
      method: "call",
      url: `tel:${partner.phone}`,
    },
  ].filter(Boolean);
};


  /* ---------------- ORDER INTENT ---------------- */
const handleOrderConfirm = async (method, url) => {
  if (!orderFood) return;

  try {
    await api.post(
      "/order-intent",
      {
        foodId: orderFood._id,
        partnerId: orderFood.foodPartner?._id,
        method,
      },
      { withCredentials: true }
    );

    if (!url) {
      alert("Order link not available");
      return;
    }

    window.open(url, "_blank");
    setOrderFood(null);
  } catch (err) {
    alert("Login required to place order");
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
                {item.price && <p>₹ {item.price}</p>}

                {partner._id && (
                  <p>
                    📍{" "}
                    <Link to={`/food-partner/${partner._id}`}>
                      {partner.name}
                    </Link>
                  </p>
                )}

                <button
                  className="order-btn"
                  onClick={() => setOrderFood(item)}
                >
                  Order →
                </button>
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

      <OrderModal
        isOpen={!!orderFood}
        methods={orderFood ? getOrderMethods(orderFood) : []}
        onClose={() => setOrderFood(null)}
        onConfirm={handleOrderConfirm}
      />
    </div>
  );
};

export default ReelFeed;
