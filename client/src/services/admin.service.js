import axios from "axios";

// const API_URL = "http://localhost:8000/api";
const API_URL = import.meta.env.VITE_API_GATEWAY_URL;

const getHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
});

export const adminService = {
  getUsers: async () => {
    const res = await axios.get(`${API_URL}/auth/admin/users`, getHeaders());
    return res.data;
  },

  updateUserRole: async (userId, newRole) => {
    const res = await axios.patch(
      `${API_URL}/auth/admin/users/role`,
      { userId, newRole },
      getHeaders(),
    );
    return res.data;
  },

  getAllVideos: async () => {
    const res = await axios.get(`${API_URL}/videos/admin/all`, getHeaders());
    return res.data;
  },
  deleteVideo: async (videoId) => {
    const res = await axios.delete(
      `${API_URL}/videos/admin/${videoId}`,
      getHeaders(),
    );
    return res.data;
  },
  togglePremium: async (videoId) => {
    const res = await axios.patch(
      `${API_URL}/videos/admin/${videoId}/premium`,
      {},
      getHeaders(),
    );
    return res.data;
  },
  // --- Profile Service Admin Calls (New) ---

  getAllProfiles: async () => {
    const res = await axios.get(
      `${API_URL}/profile/admin/profiles/all`,
      getHeaders(),
    );
    return res.data;
  },

  updateProfileByAdmin: async (profileId, updateData) => {
    const res = await axios.patch(
      `${API_URL}/profile/admin/profiles/${profileId}`,
      updateData,
      getHeaders(),
    );
    return res.data;
  },

  getSubscriptionStats: async () => {
    const res = await axios.get(
      `${API_URL}/profile/admin/subscriptions/stats`,
      getHeaders(),
    );
    return res.data;
  },

  removeSubscriberByAdmin: async (subscriptionId) => {
    const res = await axios.delete(
      `${API_URL}/profile/admin/subscriptions/${subscriptionId}`,
      getHeaders(),
    );
    return res.data;
  },

  getVideoStats: async (videoId) => {
    const response = await axios.get(
      `${API_URL}/interactions/admin/video-stats/${videoId}`,
      getHeaders(),
    );
    return response.data;
  },

  getAllVideoStats: async () => {
    const response = await axios.get(
      `${API_URL}/interactions/admin/all-stats`,
      getHeaders(),
    );
    return response.data;
  },

  getAllPlans: async () => {
    const res = await axios.get(`${API_URL}/payments/plans`, getHeaders());
    return res.data;
  },

  createPlan: async (planData) => {
    const res = await axios.post(
      `${API_URL}/payments/plans`,
      planData,
      getHeaders(),
    );
    return res.data;
  },

  updatePlan: async (planId, planData) => {
    const res = await axios.patch(
      `${API_URL}/payments/plans/${planId}`,
      planData,
      getHeaders(),
    );
    return res.data;
  },

  deletePlan: async (planId) => {
    const res = await axios.delete(
      `${API_URL}/payments/plans/${planId}`,
      getHeaders(),
    );
    return res.data;
  },

  getAllPayments: async () => {
    const res = await axios.get(`${API_URL}/payments/payments/all`, getHeaders());
    return res.data;
  },
};
