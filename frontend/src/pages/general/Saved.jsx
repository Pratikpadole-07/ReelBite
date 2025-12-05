import React, { useEffect, useState } from 'react'
import '../../styles/reels.css'
import axios from 'axios'
import ReelFeed from '../../components/ReelFeed'

const API_URL = "http://localhost:3000/api";

const Saved = () => {
    const [videos, setVideos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchSavedVideos();
    }, []);

    const fetchSavedVideos = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${API_URL}/food/save`, { withCredentials: true });

            const savedFoods = response.data.savedFoods.map((item) => ({
                ...item.food,  // 🔥 full data include
                _id: item.food._id,
            }));

            setVideos(savedFoods);
        } catch (err) {
            console.error("Saved Fetch Error:", err);
        }
        setIsLoading(false);
    };

    const removeSaved = async (item) => {
        try {
            await axios.post(
                `${API_URL}/food/save`,
                { foodId: item._id },
                { withCredentials: true }
            );

            setVideos((prev) =>
                prev.filter((v) => v._id !== item._id) // 🔥 instantly remove
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
