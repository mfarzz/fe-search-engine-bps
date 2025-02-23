import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { login, getGoogleAuthUrl } from '../services/auth.service';
import { Mail, LogIn, EyeOff, Eye, Home } from 'lucide-react';
import { motion } from 'framer-motion';

const AnimatedBackground = () => {
    const [nodes, setNodes] = useState([]);

    useEffect(() => {
        const createNode = () => ({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            vx: (Math.random() - 0.5) * 1,
            vy: (Math.random() - 0.5) * 1,
            size: Math.random() * 3 + 2,
        });

        setNodes(Array.from({ length: 25 }, createNode));

        const animate = () => {
            setNodes(prevNodes =>
                prevNodes.map(node => ({
                    ...node,
                    x: (node.x + node.vx + window.innerWidth) % window.innerWidth,
                    y: (node.y + node.vy + window.innerHeight) % window.innerHeight,
                }))
            );
        };

        const interval = setInterval(animate, 50);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-blue-950 via-indigo-900 to-blue-900">
            <svg className="absolute inset-0 w-full h-full">
                {nodes.map((node, i) => (
                    <g key={i}>
                        {nodes.map((otherNode, j) => {
                            const distance = Math.hypot(node.x - otherNode.x, node.y - otherNode.y);
                            if (distance < 150 && i < j) {
                                return (
                                    <line
                                        key={`${i}-${j}`}
                                        x1={node.x}
                                        y1={node.y}
                                        x2={otherNode.x}
                                        y2={otherNode.y}
                                        stroke="rgba(255,255,255,0.1)"
                                        strokeWidth="1"
                                    />
                                );
                            }
                            return null;
                        })}
                        <circle
                            cx={node.x}
                            cy={node.y}
                            r={node.size}
                            fill="rgba(255,255,255,0.3)"
                        />
                    </g>
                ))}
            </svg>
        </div>
    );
};

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const cekLogin = await login(email, password);
            if (cekLogin) {
                sessionStorage.setItem('justLoggedIn', 'true');
                navigate("/home");
            }
        } catch (error) {
            console.error("Terjadi kesalahan saat login:", error);
            Swal.fire({
                icon: 'error',
                title: 'Gagal Login',
                text: 'Email atau password salah',
                confirmButtonText: 'OK'
            });
            setEmail("");
            setPassword("");
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const googleAuthUrl = await getGoogleAuthUrl();
            sessionStorage.setItem('justLoggedIn', 'true');
            window.location.href = googleAuthUrl;
        } catch (error) {
            console.error("Gagal mendapatkan URL Google:", error);
            Swal.fire({
                icon: 'error',
                title: 'Gagal Login dengan Google',
                text: 'Terjadi kesalahan saat mencoba login dengan Google',
                confirmButtonText: 'OK'
            });
        }
    };

    const handleHomeClick = () => {
        navigate('/home');
    };

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center p-6">
            <AnimatedBackground />

            {/* Home Button - Now positioned above the login card */}
            <motion.button
                onClick={handleHomeClick}
                className="fixed top-6 right-6 z-20 flex items-center gap-2 px-4 py-2 
                         bg-white/10 backdrop-blur-md rounded-lg border border-white/20
                         text-white hover:bg-white/20 focus:outline-none focus:ring-2 
                         focus:ring-cyan-400 focus:ring-offset-2 transition-all"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Home size={18} />
                <span className="text-sm font-medium">Ke Halaman Utama</span>
            </motion.button>

            <motion.div
                className="w-full max-w-md z-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Logo dan Header */}
                <div className="text-center mb-8">
                    <motion.div
                        className="flex justify-center mb-4"
                        animate={{
                            rotate: 360
                        }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    >
                        <div className="relative w-12 h-12">
                            <img
                                src="/linkfy.png"
                                alt="Linkfy Logo"
                                className="w-full h-full brightness-150 contrast-125 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                            />
                            <div className="absolute inset-0 bg-cyan-400 opacity-20 blur-xl rounded-full -z-10" />
                        </div>
                    </motion.div>
                    <h1 className="text-4xl font-bold mb-2">
                        <span className="bg-gradient-to-r from-cyan-200 via-cyan-300 to-blue-200 
                                     bg-clip-text text-transparent 
                                     drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]
                                     filter backdrop-brightness-150">
                            Linkfy
                        </span>
                    </h1>
                    <p className="text-gray-300">Your Universal Link Hub</p>
                </div>

                {/* Card Login */}
                <motion.div
                    className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-8 space-y-6 border border-white/20"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white flex items-center gap-2">
                                <Mail size={18} />
                                Email
                            </label>
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white
                                         focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all
                                         placeholder-gray-400"
                                placeholder="Masukkan email Anda"
                                required
                            />
                        </div>

                        {/* Password Input */}
                        <div className="relative">
                            <label className="text-sm font-medium text-white flex items-center gap-2 mb-2">
                                Password
                            </label>
                            <input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type={showPassword ? "text" : "password"}
                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white 
                                         focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all 
                                         placeholder-gray-400"
                                placeholder="Masukkan password Anda"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-[60%] transform -translate-y-1/2 text-gray-400 
                                         hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-white py-3 px-4 
                                     rounded-lg font-medium hover:from-cyan-500 hover:to-blue-600 
                                     focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 
                                     transition-all flex items-center justify-center gap-2"
                        >
                            <LogIn size={18} />
                            Masuk
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-transparent text-gray-300">atau lanjutkan dengan</span>
                        </div>
                    </div>

                    {/* Google Login Button */}
                    <button
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white/5 
                                 border border-white/10 rounded-lg text-white hover:bg-white/10 
                                 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 
                                 transition-all"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        <span className="text-gray-300 font-medium">Lanjutkan dengan Google</span>
                    </button>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Login