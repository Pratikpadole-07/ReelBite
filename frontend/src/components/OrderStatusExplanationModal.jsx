import React from "react";
import "../styles/modal.css";

const OrderStatusExplanationModal = ({ open, loading, text, onClose }) => {
  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h3>Why is my order in this state?</h3>

        {loading ? (
          <p>Generating explanation…</p>
        ) : (
          <pre className="explanation-text">{text}</pre>
        )}

        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default OrderStatusExplanationModal;
