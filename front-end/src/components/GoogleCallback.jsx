import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';

const GoogleCallback = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const token = new URLSearchParams(location.search).get('token');

        if (token) {
            try {
                // Simpan token ke localStorage
                localStorage.setItem('token', token);

                // Tampilkan pesan sukses

                // Setelah user klik OK, redirect ke home
                navigate('/home', { replace: true });
            } catch (error) {
                console.error('Error handling Google callback:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal Login',
                    text: 'Terjadi kesalahan saat proses login',
                    confirmButtonText: 'OK'
                }).then(() => {
                    navigate('/login');
                });
            }
        } else {
            // Jika tidak ada token, kembali ke login
            navigate('/login');
        }
    }, [navigate, location]);

    // Tampilkan loading spinner selama proses
    return (
        <div className="h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
    );
};

export default GoogleCallback;