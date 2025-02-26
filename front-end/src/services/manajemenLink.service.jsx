import axios from "axios";

// export const API_URL = "https://search-engine-production-1b02.up.railway.app/";
export const API_URL = "https://linkfy-be-production-081e.up.railway.app"

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true
});

const multipartAxiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "multipart/form-data",
    },
    withCredentials: true
});

multipartAxiosInstance.interceptors.request.use(
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
 * Fetch list of links.
 * @param {Object} params - Parameters for fetching links.
 * @param {number} params.page - The page number (default: 1).
 * @param {number} params.limit - The number of items per page (default: 10).
 * @param {string} params.search - Search term for filtering (default: empty string).
 * @returns {Promise<Object>} - The response data from the API.
 */

export const listLink = async ({page = 1, limit =10, search = '', kategori = ''}) => {
    try {
        const result = await axiosInstance.get(`/list-link`, {
            params: {
                page,
                limit,
                search,
                kategori,
            },
        });
        return result.data;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}

export const allUser = async ({search = '', unit = ''}) => {
    try {
        const result = await axiosInstance.get(`/all-user`,{
            params: {
                search,
                unit
            },
        });
        return result.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const tambahLink = async (data) => {
    try {
        const result = await multipartAxiosInstance.post(`/add-link`,(data));
        return result.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const hapusLink = async (id) => {
    try {
        const result = await axiosInstance.delete(`/delete-link/${id}`);
        return result.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const editLink = async (id, data) => {
    try {
        const result = await multipartAxiosInstance.put(`/edit-link/${id}`, data);
        return result.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}