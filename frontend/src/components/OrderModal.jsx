import React from "react";
import "../styles/OrderModal.css";

const OrderModal = ({ isOpen, methods = [], onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="order-modal-backdrop" onClick={onClose}>
      <div
        className="order-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h3>Choose Order Method</h3>

        {methods.length === 0 ? (
          <p className="order-empty">No order options available</p>
        ) : (
          methods.map(({ label, method, url }) => (
            <button
              key={method}
              className="order-option"
              onClick={() => onConfirm(method, url)}
            >
              {label}
            </button>
          ))
        )}

        <button className="cancel-btn" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default OrderModal;
