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
  const [tab, setTab] = useState("forYou"); // only affects backend filter

  const fetchVideos = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${API_URL}/food`, {
        withCredentials: true,
        params: {
          search,
          category,
          onlyFollowed: tab === "following",
        },
      });

      setVideos(res.data.foodItems || []);
    } catch (err) {
      console.error("Error fetching food:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [search, category, tab]);

  const likeVideo = async (item) => {
    const prevVideos = [...videos];

    setVideos((list) =>
      list.map((v) =>
        v._id === item._id
          ? {
              ...v,
              _likedByMe: !v._likedByMe,
              likeCount: v._likedByMe
                ? Math.max(0, v.likeCount - 1)
                : v.likeCount + 1,
            }
          : v
      )
    );

    try {
      await axios.post(
        `${API_URL}/food/like`,
        { foodId: item._id },
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Like error:", err);
      setVideos(prevVideos);
    }
  };

  const saveVideo = async (item) => {
    const prevVideos = [...videos];

    setVideos((list) =>
      list.map((v) =>
        v._id === item._id
          ? {
              ...v,
              _savedByMe: !v._savedByMe,
              savesCount: v._savedByMe
                ? Math.max(0, v.savesCount - 1)
                : v.savesCount + 1,
            }
          : v
      )
    );

    try {
      await axios.post(
        `${API_URL}/food/save`,
        { foodId: item._id },
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Save error:", err);
      setVideos(prevVideos);
    }
  };

  return (
    <>
      {/* Filters */}
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

      {/* Feed Tabs */}
      <div className="feed-tabs">
        <button
          className={tab === "forYou" ? "active" : ""}
          onClick={() => setTab("forYou")}
        >
          All Reels
        </button>
        <button
          className={tab === "following" ? "active" : ""}
          onClick={() => setTab("following")}
        >
          Following
        </button>
      </div>

      {/* Feed */}
      <ReelFeed
        items={videos}
        onLike={likeVideo}
        onSave={saveVideo}
        emptyMessage="No reels found"
        isLoading={isLoading}
      />
    </>
  );
};

export default Home;
