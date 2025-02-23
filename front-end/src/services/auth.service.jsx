import axios from "axios";

const API_URL = "https://search-engine-production-1b02.up.railway.app/auth";

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true // Important for handling cookies
});

// Add response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        // If error is 403 and we haven't tried refreshing yet
        if (error.response?.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                // Try to refresh the token
                const { accessToken } = await refreshToken();
                
                // Update the token in localStorage
                localStorage.setItem('token', accessToken);
                
                // Retry the original request with new token
                originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                // If refresh fails, logout the user
                await logout();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

// Helper function to set auth header
const setAuthHeader = (token) => {
    if (token) {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete axiosInstance.defaults.headers.common['Authorization'];
    }
};

export const login = async (email, password) => {
    try {
        const response = await axiosInstance.post("/login", {
            email,
            password
        });
        
        const { accessToken } = response.data;
        if (accessToken) {
            localStorage.setItem('token', accessToken);
            setAuthHeader(accessToken);
        } else {
            throw new Error("No access token received");
        }
        
        return response.data;
    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
};

export const getGoogleAuthUrl = async () => {
    try {
        const response = await axiosInstance.get("/google");
        return response.data.url;
    } catch (error) {
        console.error("Google auth URL error:", error);
        throw error;
    }
};

export const handleGoogleCallback = async (code) => {
    try {
        const response = await axiosInstance.get(`/google/callback?code=${code}`);
        const { accessToken } = response.data;
        
        if (accessToken) {
            localStorage.setItem('token', accessToken);
            setAuthHeader(accessToken);
        }
        
        return response.data;
    } catch (error) {
        console.error("Google callback error:", error);
        throw error;
    }
};

export const logout = async () => {
    try {
        const token = localStorage.getItem('token');
        if (token) {
            await axiosInstance.post('/logout', {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                withCredentials: true
            });
        }
        
        // Clear auth data
        localStorage.removeItem('token');
        setAuthHeader(null);
    } catch (error) {
        console.error("Logout error:", error);
        // Still clear local data even if server request fails
        localStorage.removeItem('token');
        setAuthHeader(null);
        throw error;
    }
};

export const refreshToken = async () => {
    try {
        const response = await axiosInstance.post("/refresh-token");
        const { accessToken } = response.data;
        
        if (accessToken) {
            setAuthHeader(accessToken);
        }
        
        return response.data;
    } catch (error) {
        console.error("Token refresh error:", error);
        throw error;
    }
};

export const changePassword = async (password, confirmPassword) => {
    try {
        const response = await axiosInstance.put("/change-password", {
            password,
            confirmPassword
        });
        
        return response.data;
    } catch (error) {
        console.error("Change password error:", error);
        throw error;
    }
}

// Initialize auth header from localStorage on service load
const token = localStorage.getItem('token');
if (token) {
    setAuthHeader(token);
}