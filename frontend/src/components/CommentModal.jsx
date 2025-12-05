import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:3000/api";

const CommentModal = ({ foodId, isOpen, onClose }) => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  const fetchComments = async () => {
    if (!foodId) return;
    try {
      const res = await axios.get(`${API_URL}/comments/${foodId}`, {
        withCredentials: true,
      });
      setComments(res.data.comments || []);
    } catch (err) {
      console.error("Fetch comments error:", err);
    }
  };

  useEffect(() => {
    if (isOpen) fetchComments();
  }, [isOpen, foodId]);

  const addComment = async () => {
    if (!text.trim()) return;
    try {
      await axios.post(
        `${API_URL}/comments`,
        { foodId, text },
        { withCredentials: true }
      );
      setText("");
      fetchComments();
    } catch (err) {
      console.error("Comment add error:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="comment-overlay">
      <div className="comment-box">
        <button className="close-btn" onClick={onClose}>✖</button>

        <div className="comment-list">
          {comments.map((c) => (
            <p key={c._id}>
              <strong>{c.user?.name || "User"}:</strong> {c.text}
            </p>
          ))}

          {comments.length === 0 && (
            <p style={{ textAlign: "center", color: "#aaa" }}>
              No comments yet. Be first! ✨
            </p>
          )}
        </div>

        <div className="comment-input-box">
          <input
            type="text"
            placeholder="Add a comment..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button onClick={addComment}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
