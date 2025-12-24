import React, { useEffect, useState } from "react";
import "../../styles/reels.css";
import api from "../../assets/api/api";
import ReelFeed from "../../components/ReelFeed";

const Saved = () => {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSavedVideos();
  }, []);

  const fetchSavedVideos = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/food/saved");
      setVideos(res.data.foods || []);
    } catch (err) {
      console.error("Saved Fetch Error:", err);
      setVideos([]);
    } finally {
      setIsLoading(false);
    }
  };

  const removeSaved = async (item) => {
    try {
      await api.post("/food/save", { foodId: item._id });

      setVideos((prev) =>
        prev.filter((v) => v._id !== item._id)
      );
    } catch (err) {
      console.error("Unsave Error:", err);
    }
  };

  return (
    <ReelFeed
      items={videos}
      onSave={removeSaved}
      emptyMessage="No saved videos yet."
      isLoading={isLoading}
    />
  );
};

export default Saved;
