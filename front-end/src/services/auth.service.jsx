import axios from "axios";

const API_URL = "http://localhost:3000/auth";

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
        // "Authorization": `Bearer ${localStorage.getItem('token')}`
    },
    withCredentials: true
});

export const login = async (email, password) => {
    try {
        const response = await axiosInstance.post("/login", {
            email,
            password
        });
        const { accessToken } = response.data;
        if (accessToken) {
            localStorage.setItem('token', accessToken);
        } else {
            throw { error: "No access token received" };
        }
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const logout = async () => {
    try {
        const token = localStorage.getItem('token');

        if (token) {
            await axiosInstance.post('/logout', {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        }

        // Clear all auth related data
        localStorage.removeItem('token');
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const refreshToken = async () => {
    try {
        const response = await axiosInstance.post("/refresh-token");
        return response.data;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}
