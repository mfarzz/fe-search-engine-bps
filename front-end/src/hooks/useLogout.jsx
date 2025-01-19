import { logout } from '../services/auth.service';

const useLogout = () => {
    const handleLogout = async () => {
        try {
            await logout();
            window.location.href = "/";
        } catch (error) {
            console.error("Logout Error:", error);
            alert("Gagal logout. Silakan coba lagi.");
        }
    };

    return handleLogout;
};

export default useLogout;