import axios from "axios";

const MOCK_API_BASE = "https://ankita-elterleben.onrender.com";

// Get list of experts
export const getExperts = async () => {
  const res = await axios.get(`${MOCK_API_BASE}/experts`);
  return res.data;
};

// Get webinars
export const getWebinars = async () => {
  const res = await axios.get(`${MOCK_API_BASE}/webinars`);
  return res.data;
};

// Register for a webinar
export const registerForWebinar = async (webinarId, registrantData) => {
  const res = await axios.post(
    `${MOCK_API_BASE}/webinars/${webinarId}/registrants`,
    registrantData
  );
  return res.data;
};

// Book a consultation
export const bookAppointment = async (appointmentData) => {
  const res = await axios.post(
    `${MOCK_API_BASE}/bookings/new`,
    appointmentData
  );
  return res.data;
};

// Get all paid videos
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
