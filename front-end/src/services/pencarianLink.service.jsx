import axios from "axios";

export const API_URL = "https://search-engine-production-1b02.up.railway.app/";

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
        const result = await axiosInstance.get(`/query-history`);
        return {
            success: result.data.success,
            count: result.data.count,
            data: result.data.data.map(item => ({
                query: item.query,
                // createdAt: item.createdAt
            }))
        };
    } catch (error) {
        console.error('Error in getKueri service:', error);
        throw error.response?.data || {
            success: false,
            message: 'Terjadi kesalahan pada server',
            error: error.message
        };
    }
}

export const hapusKueri = async (query) => {
    try {
        const result = await axiosInstance.delete(`/delete-query-history`, {
            data: { query }
        });
        return {
            success: result.data.success,
            message: result.data.message
        };
    } catch (error) {
        console.error('Error in hapusKueri service:', error);
        throw error.response?.data || {
            success: false,
            message: 'Terjadi kesalahan pada server',
            error: error.message
        };
    }
}

export const cariLink = async ({query, page = 1, limit = 10}) => {
    try {
        // const encodedQuery = encodeURIComponent(query);
        const result = await axiosInstance.get(`/search-link`, {
            params: {
                q: query,
                page,
                limit
            }
        });
        
        if (result.data.status) {
            return {
                status: result.data.status,
                message: result.data.message,
                data: result.data.data,
                pagination: result.data.pagination,
                metadata: result.data.metadata
            };
        } else {
            throw new Error(result.data.message || 'Failed to fetch search results');
        }
    } catch (error) {
        console.error('Error in cariLink service:', error);
        throw error.response?.data || {
            status: false,
            message: 'Terjadi kesalahan pada server',
            error: error.message
        };
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

export const exploreLink = async (limit = 10, offset = 0, kategori = '') => {
    try {
        const result = await axiosInstance.get('/explore-link', {
            params: {
                limit: Math.max(1, parseInt(limit)),
                offset: Math.max(0, parseInt(offset)),
                kategori
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