import React, {
  useEffect,
  useRef,
  useState,
  useContext,
  useCallback
} from "react";
import { Link } from "react-router-dom";
import api from "../assets/api/api";
import CommentModal from "./CommentModal";
import { AuthContext } from "../context/AuthContext";

const ReelFeed = ({
  items: externalItems,
  search = "",
  category = "All",
  onlyFollowed = false,
  emptyMessage = "No reels.",
  isLoading = false,
  disableInfiniteScroll = false
}) => {
  const { user } = useContext(AuthContext);

  /* ================= STATE ================= */
  const [items, setItems] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const [activeCommentFoodId, setActiveCommentFoodId] = useState(null);
  const [placingOrderId, setPlacingOrderId] = useState(null);

  /* ================= SYNC SAVED ITEMS ================= */
  useEffect(() => {
    if (disableInfiniteScroll) {
      setItems(externalItems || []);
    }
  }, [externalItems, disableInfiniteScroll]);

  /* ================= VIDEO AUTOPLAY ================= */
  const videoRefs = useRef(new Map());

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

  /* ================= FETCH REELS (HOME ONLY) ================= */
  const fetchReels = async () => {
    if (disableInfiniteScroll || loading || !hasMore) return;

    setLoading(true);
    try {
      const res = await api.get("/food/reels", {
        params: {
          cursor,
          limit: 5,
          search,
          category,
          onlyFollowed
        }
      });

      const newReels = res.data.reels || [];
      setItems(prev => [...prev, ...newReels]);
      setCursor(res.data.nextCursor || null);
      setHasMore(Boolean(res.data.nextCursor));
    } finally {
      setLoading(false);
    }
  };

  /* ================= RESET ON FILTER CHANGE ================= */
  useEffect(() => {
    if (disableInfiniteScroll) return;

    setItems([]);
    setCursor(null);
    setHasMore(true);
    fetchReels();
  }, [search, category, onlyFollowed]);

  /* ================= INFINITE SCROLL ================= */
  const observerRef = useRef(null);

  const lastReelRef = useCallback(
    node => {
      if (disableInfiniteScroll || loading || !hasMore) return;

      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) fetchReels();
      });

      if (node) observerRef.current.observe(node);
    },
    [loading, hasMore, disableInfiniteScroll]
  );

  /* ================= LIKE ================= */
  const handleLike = async foodId => {
    const res = await api.post("/food/like", { foodId });

    setItems(prev =>
      prev.map(item =>
        item._id === foodId
          ? {
              ...item,
              likeCount: res.data.liked
                ? item.likeCount + 1
                : Math.max(0, item.likeCount - 1)
            }
          : item
      )
    );
  };

  /* ================= SAVE ================= */
  const handleSave = async foodId => {
    const res = await api.post("/food/save", { foodId });

    setItems(prev =>
      prev.map(item =>
        item._id === foodId
          ? {
              ...item,
              isSaved: res.data.saved,
              savesCount: res.data.saved
                ? item.savesCount + 1
                : Math.max(0, item.savesCount - 1)
            }
          : item
      )
    );
  };

  /* ================= COMMENT COUNT ================= */
  const incrementCommentCount = foodId => {
    setItems(prev =>
      prev.map(item =>
        item._id === foodId
          ? {
              ...item,
              commentsCount: (item.commentsCount || 0) + 1
            }
          : item
      )
    );
  };

  /* ================= PLACE ORDER ================= */
  const placeOrder = async foodId => {
    try {
      setPlacingOrderId(foodId);
      await api.post("/order", { foodId });
      alert("Order placed");
    } finally {
      setPlacingOrderId(null);
    }
  };

  /* ================= EMPTY ================= */
  if (!items.length && !loading && !isLoading) {
    return <div className="reel-page">{emptyMessage}</div>;
  }

  /* ================= RENDER ================= */
  return (
    <div className="reel-page">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const partner = item.foodPartner;

        return (
          <div
            key={item._id}
            ref={!disableInfiniteScroll && isLast ? lastReelRef : null}
            className="reel-row"
          >
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
                <button onClick={() => handleLike(item._id)}>❤️</button>
                <span>{item.likeCount || 0}</span>

                <button onClick={() => handleSave(item._id)}>
                  {item.isSaved ? "🔖" : "📑"}
                </button>
                <span>{item.savesCount || 0}</span>

                <button onClick={() => setActiveCommentFoodId(item._id)}>
                  💬
                </button>
              </div>

              <div className="food-info">
                <h3>{item.name}</h3>
                {item.description && <p>{item.description}</p>}
                {item.price && <p>Rs {item.price}</p>}

                {partner?._id && (
                  <Link
                    to={`/restaurant/${partner._id}`}
                    className="partner-link"
                  >
                    <img
                      src={partner.logo || "https://placehold.co/40x40"}
                      alt={partner.name}
                      className="partner-mini-logo"
                    />
                    <span>{partner.name}</span>
                  </Link>
                )}

                {user && (
                  <button
                    className="order-btn"
                    disabled={placingOrderId === item._id}
                    onClick={() => placeOrder(item._id)}
                  >
                    {placingOrderId === item._id
                      ? "Placing..."
                      : "Order Now"}
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {(loading || isLoading) && <p className="loading-text">Loading…</p>}

      <CommentModal
        foodId={activeCommentFoodId}
        isOpen={!!activeCommentFoodId}
        onClose={() => setActiveCommentFoodId(null)}
        onCommentAdded={incrementCommentCount}
      />
    </div>
  );
};

export default ReelFeed;
