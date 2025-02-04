import axios from "axios";

export const API_URL = "http://localhost:3000/";

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const tambahFeedback = async (feedback) => {
    try {
        const result = await axiosInstance.post(`/add-feedback`, {
            feedback: feedback
        });
        return result.data;
    }
    catch (error) {
        throw error;
    }
}