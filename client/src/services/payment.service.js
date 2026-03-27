import axios from 'axios';

// const BASE_URL = 'http://localhost:8000/api/payments';
const BASE_URL = `${import.meta.env.VITE_API_GATEWAY_URL}/payments`;

const getHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
});

export const paymentService = {
    getPlans: async () => {
        const res = await axios.get(`${BASE_URL}/plans`, getHeaders());
        return res.data;
    },

    
    createOrder: async (planId) => {
        const res = await axios.post(`${BASE_URL}/payments/checkout`, { planId }, getHeaders());
        return res.data;
    },

    
    verifyPayment: async (paymentData) => {
        const res = await axios.post(`${BASE_URL}/payments/verify`, paymentData, getHeaders());
        return res.data;
    },

   
    getSubscriptionStatus: async () => {
        const res = await axios.get(`${BASE_URL}/subscriptions/status`, getHeaders());
        return res.data;
    }
};