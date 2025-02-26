import axios from "axios";

// export const API_URL = "https://search-engine-production-1b02.up.railway.app/";
export const API_URL = "https://linkfy-be-production-081e.up.railway.app"

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

export const seringDikunjungi = async () => {
    try {
        const result = await axiosInstance.get(`/most-visited`, {});
        return result.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const terakhirDikunjungi = async () => {
    try {
        const result = await axiosInstance.get(`/last-visited`, {});
        return result.data;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}