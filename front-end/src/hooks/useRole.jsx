import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";

const useRole = () => {
    const [role, setRole] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decodedToken = jwtDecode(token); // Dekode token
                setRole(decodedToken.role); // Ambil 'role' dari token
            } catch (error) {
                console.error("Token decoding error:", error);
            }
        }
    }, []);
    return role;
};

export default useRole;
