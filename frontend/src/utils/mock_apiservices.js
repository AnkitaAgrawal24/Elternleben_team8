// Get all paid videos
import axios from "axios";
const MOCK_API_BASE = "http://127.0.0.1:8000";

export const getVideos = async () => {
  const res = await axios.get(`${MOCK_API_BASE}/videos`);
  return res.data;
};

// Purchase a video
export const purchaseVideo = async (videoId, userInfo) => {
  const res = await axios.post(
    `${MOCK_API_BASE}/videos/${videoId}/purchase`,
    userInfo
  );
  return res.data;
};
