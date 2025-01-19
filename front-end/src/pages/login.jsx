import { useState } from 'react';
import Logo from '../components/Logo';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { login } from '../services/auth.service';

const Login = () => {
    const backgroundImage = 'url(src/assets/bg4.jpg)';
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const cekLogin = await login(email, password);
            if (cekLogin) {
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil Login',
                    text: 'Selamat datang di website kami',
                    confirmButtonText: 'OK'
                })
                navigate("/home");
            }
        } catch (error) {
            console.error("Terjadi kesalahan saat login:", error);
            Swal.fire({
                icon: 'error',
                title: 'Gagal Login',
                text: 'Email atau password salah',
                confirmButtonText: 'OK'
            })
            setEmail("");
            setPassword("");
        }
    };

    return (
        <div className="relative h-screen bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: backgroundImage }}>
            <div className="absolute inset-0 bg-black bg-opacity-50" style={{ backdropFilter: "blur(10px)" }}></div>

            <div className="relative bg-white bg-opacity-15 p-8 rounded-xl shadow-xl w-3/4 max-w-xl min-w-96">
                {/* Logo and Header */}
                <Logo />

                {/* Login Form */}
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-medium text-white">
                            Email
                        </label>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            id="email"
                            className="w-full h-12 px-3 py-2 bg-white bg-opacity-10 border border-gray-300 rounded-md text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Masukkan email"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="password" className="block text-sm font-medium text-white">
                            Password
                        </label>
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            id="password"
                            className="w-full h-12 px-3 py-2 bg-white bg-opacity-10 border border-gray-300 rounded-md text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Masukkan password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        // onClick={handleSubmit}
                        className="w-full h-12 bg-blue-600 py-2 px-4 border border-transparent rounded-md text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;