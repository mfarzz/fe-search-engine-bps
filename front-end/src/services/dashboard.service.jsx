import axios from "axios";

export const API_URL = "http://localhost:3000/";

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json"
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

export const hourlyVisitors = async () => {
    try {
        const result = await axiosInstance.get(`/hourly`);
        return result.data;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}

export const dailyVisitors = async () => {
    try {
        const result = await axiosInstance.get(`/daily-stats`);
        return result.data;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}

export const summaryVisitors = async () => {
    try {
        const result = await axiosInstance.get(`/summary`);
        return result.data;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}

export const countUsers = async () => {
    try {
        const result = await axiosInstance.get(`/count-user-login`);
        return result.data;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}

export const countLink = async () => {
    try {
        const result = await axiosInstance.get(`/count-link`);
        return result.data;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}

export const hourlyLink = async () => {
    try {
        const result = await axiosInstance.get(`/hourly-link`);
        return result.data;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}

export const dailyLink = async () => {
    try {
        const result = await axiosInstance.get(`/daily-link`);
        return result.data;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}

export const topLink = async () => {
    try {
        const result = await axiosInstance.get(`/top-link`);
        return result.data;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}

export const topLinkDaily = async () => {
    try {
        const result = await axiosInstance.get(`/top-link-daily`);
        return result.data;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}