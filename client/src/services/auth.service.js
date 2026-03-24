import axios from 'axios';

const API_URL = 'http://localhost:8000/api/auth';
// const API_URL = 'http://localhost:5000/api/auth';

export const authService = {
  sendOtp: async (email) => {
    const response = await axios.post(`${API_URL}/send-otp`, { email });
    return response.data;
  },

  resendOtp: async (email) => {
    const response = await axios.post(`${API_URL}/resend-otp`, { email });
    return response.data;
  },
  
  verifyOtp: async (email, otp) => {
    const response = await axios.post(`${API_URL}/verify-otp`, { email, otp });
    return response.data;
  },

  register: async (userData) => {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  },

  googleLogin: () => {
    window.location.href = `${API_URL}/google`;
  },

  getCurrentUser: () => {
    const userString = localStorage.getItem("user");
    try {
      return userString ? JSON.parse(userString) : null;
    } catch (error) {
      console.error("Error parsing user from localStorage", error);
      return null;
    }
  },

  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    window.location.href = "/login";
  }
};