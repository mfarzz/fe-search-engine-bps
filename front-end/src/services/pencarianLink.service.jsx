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

export const getKueri = async () => {
    try {
        const result = await axiosInstance.get(`/query-history`, {});
        return result.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const cariLink = async ({query, page = 1, limit = 10}) => {
    try {
        const result = await axiosInstance.get(`/search-link?q=${query}&page=${page}&limit=${limit}`, {});
        console.log(query);
        return result.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const klikLink = async (linkId) => {
    try {
        const result = await axiosInstance.post(`/click-link`, {
            linkId
        });
        return result.data;
    } catch (error) {
        console.error('Error in klikLink service:', error);
        throw error.response?.data || {
            status: false,
            message: 'Terjadi kesalahan pada server',
            error: error.message
        };
    }
}

export const exploreLink = async (limit = 10, offset = 0) => {
    try {
        const result = await axiosInstance.get('/explore-link', {
            params: {
                limit: Math.max(1, parseInt(limit)),
                offset: Math.max(0, parseInt(offset))
            }
        });
        
        return {
            status: result.data.status,
            data: result.data.data,
            hasMore: result.data.hasMore
        };
    } catch (error) {
        console.error('Error in exploreLink service:', error);
        throw error;
    }
}