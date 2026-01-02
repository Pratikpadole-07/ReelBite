import React, { useEffect, useState, useContext } from "react";
import api from "../assets/api/api";
import { AuthContext } from "../context/AuthContext";

const CommentModal = ({ foodId, isOpen, onClose,onCommentAdded }) => {
  const { user } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!foodId) return;
    loadComments();
  }, [foodId]);

  const loadComments = async () => {
    try {
      const res = await api.get(`/food/comments/${foodId}`);
      setComments(res.data.comments || []);
    } catch (err) {
      console.log("Load comments failed");
    }
  };

const addComment = async () => {
  if (!input.trim()) return;

  setLoading(true);
  try {
    const res = await api.post("/food/comment", {
      foodId,
      text: input
    });

    setComments(prev => [res.data.comment, ...prev]);

    onCommentAdded(foodId); // 🔥 THIS WAS MISSING

    setInput("");
  } catch {
    console.log("Add comment failed");
  }
  setLoading(false);
};

  const deleteComment = async (id) => {
    try {
      await api.delete(`/food/comment/${id}`);
      setComments(prev => prev.filter(c => c._id !== id));
    } catch {
      console.log("Delete comment failed");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="cm-backdrop" onClick={onClose}>
      <div className="cm-box" onClick={(e) => e.stopPropagation()}>

        <div className="cm-head">
          <span>Comments</span>
          <button className="cm-close" onClick={onClose}>x</button>
        </div>

        <div className="cm-body">
          {comments.length === 0 && (
            <p className="cm-empty">No comments yet</p>
          )}

          {comments.map((c) => (
            <div key={c._id} className="cm-item">
              <div className="cm-user">{c.user?.name || "User"}</div>
              <div className="cm-text">{c.text}</div>
              {user && user._id === c.user?._id && (
                <button className="cm-del" onClick={() => deleteComment(c._id)}>
                  delete
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="cm-input">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Write a comment..."
          />
          <button disabled={loading} onClick={addComment}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
