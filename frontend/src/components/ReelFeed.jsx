import React, { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import api from "../assets/api/api"
import CommentModal from "./CommentModal"
import OrderModal from "./OrderModal"

const ReelFeed = ({
  items = [],
  onLike,
  onSave,
  emptyMessage = "No reels.",
  isLoading = false
}) => {
  const [activeCommentsFood, setActiveCommentsFood] = useState(null)
  const [orderingFood, setOrderingFood] = useState(null)

  const videoRefs = useRef(new Map())

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const video = entry.target
        if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
          video.play().catch(() => {})
        } else {
          video.pause()
        }
      })
    }, { threshold: 0.6 })

    videoRefs.current.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [items])

  const setVideoRef = (id) => (el) => {
    if (!el) videoRefs.current.delete(id)
    else videoRefs.current.set(id, el)
  }

  const submitOrder = async (method) => {
    if (!orderingFood) return

    try {
      await api.post(
        "/order",
        { foodId: orderingFood._id, method },
        { withCredentials: true }
      )
    } catch (err) {
      console.error("Order failed:", err)
    }

    const partner = orderingFood.foodPartner || {}
    const links = partner.orderLinks || {}

    const url =
      links[method] ||
      orderingFood.orderLink ||
      ""

    if (url) window.open(url, "_blank")
    setOrderingFood(null)
  }

  if (isLoading) {
    return (
      <div className="reel-page">
        <h3 style={{color:"#aaa"}}>Loading reels...</h3>
      </div>
    )
  }

  if (!items.length) {
    return (
      <div className="reel-page">
        <p style={{color:"#999"}}>{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="reel-page">
      {items.map((item) => {
        const partner = item.foodPartner || {}

        return (
          <div key={item._id} className="reel-row">
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

            <div className="right-panel">
              <div className="action-group">
                <button
                  className={item._likedByMe ? "active" : ""}
                  onClick={() => onLike(item)}
                >
                  ❤️
                </button>
                <span>{item.likeCount ?? 0}</span>

                <button
                  className={item._savedByMe ? "active" : ""}
                  onClick={() => onSave(item)}
                >
                  🔖
                </button>
                <span>{item.savesCount ?? 0}</span>

                <button onClick={() => setActiveCommentsFood(item._id)}>
                  💬
                </button>
                <span>{item.commentsCount ?? 0}</span>
              </div>

              <div className="food-info">
                <h3 className="title">{item.name}</h3>

                {item.description && <p className="desc">{item.description}</p>}
                {item.price && <p className="price">₹ {item.price}</p>}

                {partner._id && (
                  <Link
                    to={`/food-partner/${partner._id}`}
                    className="loc"
                  >
                    📍 {partner.name}
                  </Link>
                )}

                <button
                  className="order-btn"
                  onClick={() => setOrderingFood(item)}
                >
                  Order →
                </button>
              </div>
            </div>
          </div>
        )
      })}

      <CommentModal
        foodId={activeCommentsFood}
        isOpen={!!activeCommentsFood}
        onClose={() => setActiveCommentsFood(null)}
      />

      <OrderModal
        food={orderingFood}
        isOpen={!!orderingFood}
        onClose={() => setOrderingFood(null)}
        onConfirm={(method) => submitOrder(method)}
      />
    </div>
  )
}

export default ReelFeed
