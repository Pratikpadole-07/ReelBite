import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import CommentModal from "./CommentModal";

const ReelFeed = ({ items = [], onLike, onSave }) => {
  const [activeCommentsFood, setActiveCommentsFood] = useState(null);
  const videoRefs = useRef(new Map());

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    }, { threshold: 0.6 });

    videoRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  const setVideoRef = (id) => (el) => {
    if (!el) videoRefs.current.delete(id);
    else videoRefs.current.set(id, el);
  };

  return (
    <div className="reel-page">
      {items.map((item) => {
        const partner = item.foodPartner || {};
        const orderUrl =
          item.orderLink ||
          partner.orderLinks?.zomato ||
          partner.orderLinks?.swiggy ||
          partner.orderLinks?.website ||
          "";

        return (
          <div key={item._id} className="reel-row">

            {/* LEFT — Video */}
            <div className="reel-box">
              <video
                ref={setVideoRef(item._id)}
                className="reel-video"
                src={item.video}
                muted
                loop
                playsInline
              />
            </div>

            {/* RIGHT — Actions + Info */}
            <div className="right-panel">

              {/* Action Icons */}
              <div className="action-group">
                <button onClick={() => onLike(item)}>❤️</button>
                <span>{item.likeCount ?? 0}</span>

                <button onClick={() => onSave(item)}>🔖</button>
                <span>{item.savesCount ?? 0}</span>

                <button onClick={() => setActiveCommentsFood(item._id)}>💬</button>
                <span>{item.commentsCount ?? 0}</span>
              </div>

              {/* Food Info */}
              <div className="food-info">
                <h3 className="title">{item.name}</h3>

                {item.description && (
                  <p className="desc">{item.description}</p>
                )}

                {item.price && (
                  <p className="price">₹ {item.price}</p>
                )}

                {partner.name && (
                  <p className="loc">📍 {partner.name}</p>
                )}

                {orderUrl && (
                  <a
                    href={orderUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="order-btn"
                  >
                    Order Now →
                  </a>
                )}
              </div>

            </div>
          </div>
        );
      })}

      {/* Comments Modal */}
      <CommentModal
        foodId={activeCommentsFood}
        isOpen={!!activeCommentsFood}
        onClose={() => setActiveCommentsFood(null)}
      />
    </div>
  );
};

export default ReelFeed;
