import React, { useEffect, useState } from "react";
import axios from "axios";
import ReelFeed from "../../components/ReelFeed";
import TopNav from "../../components/TopNav";

const API_URL = "http://localhost:3000/api";

const MyUploads = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/food/my-uploads`, { withCredentials: true })
      .then(res => setVideos(res.data.foods))
      .catch(() => setVideos([]));
  }, []);

  return (
    <>
      <TopNav />
      <ReelFeed
        items={videos}
        emptyMessage="You haven't uploaded any reels yet 📭"
      />
    </>
  );
};

export default MyUploads;
