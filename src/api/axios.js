import axios from 'axios';

// Single source of truth for API base URL — set VITE_API_BASE_URL in .env / Vercel dashboard
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://loansphere-backend.onrender.com/api';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000, // 30s — covers Render free-tier cold starts
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor — attach JWT token if present
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor — uniform error messages
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
            return Promise.reject(new Error('Request timed out. The server may be starting up — please try again.'));
        }
        if (!error.response) {
            // Network error / CORS block
            return Promise.reject(new Error('Unable to reach the server. Check your connection or try again shortly.'));
        }
        const msg = error.response?.data?.error || error.response?.data?.message || error.message;
        return Promise.reject(new Error(msg));
    }
);

export default axiosInstance;
