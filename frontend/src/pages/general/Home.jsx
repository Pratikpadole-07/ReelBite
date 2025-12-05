import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/reels.css";
import ReelFeed from "../../components/ReelFeed";

const API_URL = "http://localhost:3000/api";

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const fetchVideos = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${API_URL}/food`, {
        withCredentials: true,
        params: { search, category }
    });


      setVideos(res.data.foodItems || []); // fix here
    } catch (err) {
      console.log("Error fetching food:", err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchVideos();
  }, [search, category]);

    const likeVideo = async (item) => {
    try {
      const response = await axios.post(
        `${API_URL}/food/like`,
        { foodId: item._id },
        { withCredentials: true }
      );

      const isLiked = response.data.like;

      setVideos((prev) =>
        prev.map((v) =>
          v._id === item._id
            ? { ...v, likeCount: isLiked ? v.likeCount + 1 : v.likeCount - 1 }
            : v
        )
      );

    } catch (err) {
      console.error("Like error:", err);
    }
  };


  const saveVideo = async (item) => {
    try {
      const response = await axios.post(
        `${API_URL}/food/save`,
        { foodId: item._id },
        { withCredentials: true }
      );

      const isSaved = response.data.save;

      setVideos((prev) =>
        prev.map((v) =>
          v._id === item._id
            ? { ...v, savesCount: isSaved ? v.savesCount + 1 : v.savesCount - 1 }
            : v
        )
      );

    } catch (err) {
      console.error("Save error:", err);
    }
  };


  return (
    <>
      {/* 🔎 Search + Filter UI */}
      <div className="reel-filters">
        <input
          type="text"
          placeholder="Search food or restaurant..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="category-select"
        >
          <option value="All">All Categories</option>
          <option value="Pizza">Pizza</option>
          <option value="Burger">Burger</option>
          <option value="Desserts">Desserts</option>
          <option value="Drinks">Drinks</option>
          <option value="South Indian">South Indian</option>
          <option value="Chinese">Chinese</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <ReelFeed
        items={videos}
        onLike={likeVideo}
        onSave={saveVideo}
        emptyMessage="No food reels found."
        isLoading={isLoading}
      />
    </>
  );
};

export default Home;
