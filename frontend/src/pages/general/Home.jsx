import React, { useEffect, useState } from "react";
import "../../styles/reels.css";
import ReelFeed from "../../components/ReelFeed";
import api from "../../assets/api/api";
const Home = () => {
  /* ================= FILTER STATE ================= */
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [tab, setTab] = useState("forYou"); // forYou | following

  /* ================= DEBOUNCE SEARCH ================= */
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);
  const handleLike = async (item) => {
  try {
    await api.post("/food/like", { foodId: item._id });
  } catch (err) {
    console.error("Like failed", err);
  }
};

const handleSave = async (item) => {
  try {
    await api.post("/food/save", { foodId: item._id });
  } catch (err) {
    console.error("Save failed", err);
  }
};

  return (
    <>
      {/* ================= FILTERS ================= */}
      <div className="reel-filters">
        <input
          type="text"
          placeholder="Search food or restaurant..."
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          className="search-input"
        />

        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
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

      {/* ================= FEED TABS ================= */}
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

      {/* ================= REEL FEED ================= */}
      <ReelFeed
        search={search}
        category={category}
        onlyFollowed={tab === "following"}
        onSave={handleSave}
      />
    </>
  );
};

export default Home;
