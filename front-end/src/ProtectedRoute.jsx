import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import PropTypes from 'prop-types';
import { refreshToken } from "./services/auth.service";

const ProtectedRoute = ({ children, roles }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [authState, setAuthState] = useState({
        isAuthenticated: false,
        isAuthorized: false
    });
    const location = useLocation();

    useEffect(() => {
        const validateToken = async () => {
            try {
                let token = localStorage.getItem("token");

                // Coba refresh token jika tidak ada token
                if (!token) {
                    try {
                        const data = await refreshToken();
                        token = data.accessToken;
                        localStorage.setItem("token", token);
                    } catch (error) {
                        setAuthState({ isAuthenticated: false, isAuthorized: false });
                        setIsLoading(false);
                        throw error;
                    }
                }

                // Validasi token dan cek role
                try {
                    const decodedToken = jwtDecode(token);
                    const userRole = decodedToken.role;

                    // Cek apakah token sudah expired
                    const currentTime = Date.now() / 1000;
                    if (decodedToken.exp < currentTime) {
                        throw new Error("Token has expired");
                    }

                    setAuthState({
                        isAuthenticated: true,
                        isAuthorized: roles.includes(userRole)
                    });
                } catch (error) {
                    // Token invalid atau expired
                    localStorage.removeItem("token");
                    setAuthState({ isAuthenticated: false, isAuthorized: false });
                    throw error;
                }
            } catch (error) {
                console.error("Error during token validation:", error);
                setAuthState({ isAuthenticated: false, isAuthorized: false });
            } finally {
                setIsLoading(false);
            }
        };

        validateToken();
    }, [roles]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p>Loading...</p>
            </div>
        );
    }

    // Redirect ke login jika tidak terotentikasi
    if (!authState.isAuthenticated) {
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }

    // Redirect ke badgateway jika terotentikasi tapi tidak punya akses
    if (authState.isAuthenticated && !authState.isAuthorized) {
        return <Navigate to="/badgateway" replace />;
    }

    return children;
};

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
    roles: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default ProtectedRoute;