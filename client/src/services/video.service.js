import axios from 'axios';

// This points to your API Gateway
// const API_URL = 'http://localhost:8000/api/videos';
const API_URL = `${import.meta.env.VITE_API_GATEWAY_URL}/videos`;

// Helper to get the token from local storage
const getAuthHeader = () => {
  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const videoService = {
  // 1. Upload Video (Requires 'multipart/form-data')
  uploadVideo: async (formData) => {
    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // 2. Get All Videos
  getAllVideos: async () => {
    const response = await axios.get(`${API_URL}/all`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  // 3. Get Video by ID
  getVideoById: async (id) => {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  getMyVideos: async () => {
    const response = await axios.get(`${API_URL}/my-videos`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  // 4. Delete Video
  deleteVideo: async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  // 5. Edit Video
  editVideo: async (id, updateData) => {
    const isFormData = updateData instanceof FormData;
    
    const response = await axios.patch(`${API_URL}/update/${id}`, updateData, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
      },
    });
    return response.data;
  },


};