import axios from "axios";

export const API_URL = "https://search-engine-production-1b02.up.railway.app/";

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true
});

// Instance khusus untuk upload file
const multipartAxiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "multipart/form-data"
    },
    withCredentials: true
});

// Tambahkan interceptor untuk kedua instance
[axiosInstance, multipartAxiosInstance].forEach(instance => {
    instance.interceptors.request.use(
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
});

/**
 * Fetch list of Users.
 * @param {Object} params - Parameters for fetching Users.
 * @param {number} params.page - The page number.
 * @param {number} params.limit - The number of items per page.
 * @param {string} params.search - Search term for filtering nama or email.
 * @param {string} params.unit - Filter by unit.
 * @returns {Promise<Object>} - The response data from the API.
 */
export const listUser = async ({page = 1, limit = 10, search = '', unit = ''}) => {
    try {
        const result = await axiosInstance.get(`/list-user`, {
            params: {
                page,
                limit,
                search,
                unit
            },
        });
        return result.data;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}

/**
 * Add a new user.
 * @param {Object} userData - User data to be added.
 * @param {string} userData.email - User's email (must be gmail).
 * @param {string} userData.nama - User's name.
 * @param {string} userData.unit - User's unit/department.
 * @param {string} userData.role - User's role.
 * @returns {Promise<Object>} - The response data from the API.
 */
export const tambahUser = async (userData) => {
    try {
        const result = await axiosInstance.post('/add-user', userData);
        return result.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/**
 * Add multiple users via Excel file.
 * @param {File} file - Excel file containing user data.
 * @returns {Promise<Object>} - The response data from the API.
 */
export const tambahUserBulk = async (file) => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const result = await multipartAxiosInstance.post('/add-user-bulk', formData);
        return result.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/**
 * Edit existing user.
 * @param {string} userId - ID of the user to edit.
 * @param {Object} userData - Updated user data.
 * @param {string} userData.email - User's email (must be gmail).
 * @param {string} userData.nama - User's name.
 * @param {string} userData.unit - User's unit/department.
 * @param {string} userData.role - User's role.
 * @returns {Promise<Object>} - The response data from the API.
 */
export const editUser = async (userId, userData) => {
    try {
        const result = await axiosInstance.put(`/edit-user/${userId}`, userData);
        return result.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/**
 * Delete a user.
 * @param {string} id - ID of the user to delete.
 * @returns {Promise<Object>} - The response data from the API.
 */
export const hapusUser = async (id) => {
    try {
        const result = await axiosInstance.delete(`/delete-user/${id}`);
        return result.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}