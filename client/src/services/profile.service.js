import axios from "axios";

// const API_URL = "http://localhost:8000/api/profile";
const API_URL = `${import.meta.env.VITE_API_GATEWAY_URL}/profile`;

// Helper to get token (assuming it's in localStorage)
const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
});

export const profileService = {
  // Profile Methods
  getMyProfile: async () => {
    const response = await axios.get(`${API_URL}/me`, getAuthHeader());
    return response.data;
  },

  getBatchProfiles: async (userIds) => {
    const response = await axios.get(`${API_URL}/batch?userIds=${userIds}`, getAuthHeader());
    return response.data;
  },

  updateProfile: async (formData) => {
    const token = localStorage.getItem("accessToken"); // Double-check this key!
    const response = await axios.patch(`${API_URL}/update`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  deleteProfile: async () => {
    const token = localStorage.getItem("accessToken");
    const response = await axios.delete(`${API_URL}/delete`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // Subscription Methods
  toggleSubscription: async (channelId) => {
    const response = await axios.post(
      `${API_URL}/subscribe/${channelId}`,
      {},
      getAuthHeader(),
    );
    return response.data;
  },

  getChannelSubscribers: async (channelId) => {
    const response = await axios.get(`${API_URL}/subscribers/${channelId}`);
    return response.data;
  },

};
