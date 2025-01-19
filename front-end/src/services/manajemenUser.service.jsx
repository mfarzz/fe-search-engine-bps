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

/**
 * Fetch list of Users.
 * @param {Object} params - Parameters for fetching Users.
 * @param {number} params.page - The page number (default: 1).
 * @param {number} params.limit - The number of items per page (default: 10).
 * @param {string} params.search - Search term for filtering (default: empty string).
 * @returns {Promise<Object>} - The response data from the API.
 */

export const listUser = async ({page = 1, limit =10, search = ''}) => {
    try {
        const result = await axiosInstance.get(`/list-user`, {
            params: {
                page,
                limit,
                search,
            },
        });
        return result.data;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}

export const hapusUser = async (id) => {
    try {
        const result = await axiosInstance.delete(`/delete-user/${id}`);
        return result.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}