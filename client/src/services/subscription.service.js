import axios from 'axios';

// const API_URL = 'http://localhost:8000/api/subscription';
const API_URL = `${import.meta.env.VITE_API_GATEWAY_URL}/subscription`;

export const subscriptionService = {
    // 1. GET Channel Info & Subscriber Count
    getChannelSubscribers: async (channelId) => {
        const token = localStorage.getItem("accessToken"); 
        const res = await axios.get(`${API_URL}/subscribers/${channelId}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        return res.data;
    },

    // 2. TOGGLE Subscription (REQUIRES TOKEN)
    toggleSubscription: async (channelId) => {
        const token = localStorage.getItem("accessToken"); // Retrieve your stored JWT
        
        if (!token) {
            throw new Error("You must be logged in to subscribe");
        }

        const res = await axios.post(`${API_URL}/subscribe/${channelId}`, {}, {
            headers: {
                Authorization: `Bearer ${token}` // Send the token to verifyJWT
            }
        });
        return res.data;
    }
};