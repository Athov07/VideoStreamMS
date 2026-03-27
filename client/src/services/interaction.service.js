import axios from 'axios';

// const API_URL = 'http://localhost:8000/api/interactions';
const API_URL = `${import.meta.env.VITE_API_GATEWAY_URL}/interactions`;

const getAuthHeader = () => {
  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const interactionService = {
  // Likes
  toggleLike: async (videoId, type) => {
    const response = await axios.post(`${API_URL}/likes/${videoId}`, { type }, {
      headers: getAuthHeader()
    });
    return response.data;
  },
  getVideoStats: async (videoId) => {
    const response = await axios.get(`${API_URL}/likes/${videoId}`);
    return response.data;
  },
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  // Comments
  getVideoComments: async (videoId) => {
    const response = await axios.get(`${API_URL}/comments/video/${videoId}`);
    return response.data;
  },
  postComment: async (commentData) => {
    const response = await axios.post(`${API_URL}/comments`, commentData, {
      headers: getAuthHeader()
    });
    return response.data;
  },
  updateComment: async (commentId, data) => {
    const response = await axios.patch(
      `${API_URL}/comments/${commentId}`, 
      data, 
      { headers: getAuthHeader() }
    );
    return response.data;
  },
  deleteComment: async (commentId) => {
    const response = await axios.delete(`${API_URL}/comments/${commentId}`, {
      headers: getAuthHeader()
    });
    return response.data;
  }
};