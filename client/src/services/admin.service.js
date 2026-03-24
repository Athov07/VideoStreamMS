import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const getHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
});

export const adminService = {
    getUsers: async () => {
        const res = await axios.get(`${API_URL}/auth/admin/users`, getHeaders());
        return res.data;
    },
    updateUserRole: async (userId, newRole) => {
        const res = await axios.patch(`${API_URL}/auth/admin/users/role`, { userId, newRole }, getHeaders());
        return res.data;
    }
};