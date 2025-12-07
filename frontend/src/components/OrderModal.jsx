import React from "react"
import "./OrderModal.css"

const OrderModal = ({ food, onClose, onConfirm }) => {
  if (!food) return null

  const partner = food.foodPartner || {}
  const links = partner.orderLinks || {}

  const methods = [
    { label: "Zomato", value: "zomato", url: links.zomato },
    { label: "Swiggy", value: "swiggy", url: links.swiggy },
    { label: "Call Now", value: "call", url: links.call || links.phone }
  ].filter(m => m.url) // only show available methods

  return (
    <div className="order-modal-backdrop">
      <div className="order-modal">
        <h3>Choose Order Method</h3>
        {methods.map(m => (
          <button
            key={m.value}
            className="order-option"
            onClick={() => onConfirm(food, m.value, m.url)}
          >
            {m.label}
          </button>
        ))}

        <button className="cancel-btn" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  )
}

export default OrderModal
