import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Lock, X, EyeOff, Eye } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import { logout, changePassword } from '../services/auth.service';
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from 'framer-motion';

const AccountMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordData, setPasswordData] = useState({
        password: '',
        confirmPassword: ''
    });
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const getUserInfo = () => {
        if (!token) return null;
        try {
            const userInfo = jwtDecode(token);
            return userInfo;
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            sessionStorage.setItem('justLoggedIn', 'true');
            if (window.location.pathname === '/home') {
                window.location.reload();
            } else {
                navigate('/home');
            }
        } catch (error) {
            console.error('Logout failed:', error);
            Swal.fire({
                icon: 'error',
                title: 'Gagal Logout',
                text: 'Terjadi kesalahan saat logout',
                confirmButtonText: 'OK'
            });
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (passwordData.password !== passwordData.confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Passwords tidak cocok',
                text: 'Password dan konfirmasi password harus sama',
                confirmButtonText: 'OK'
            });
            return;
        }

        try {
            await changePassword(passwordData.password, passwordData.confirmPassword);
            Swal.fire({
                icon: 'success',
                title: 'Berhasil',
                text: 'Password berhasil diubah',
                confirmButtonText: 'OK'
            });
            setPasswordData({ password: '', confirmPassword: '' });
            setIsChangePasswordOpen(false);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Gagal',
                text: 'Gagal mengubah password',
                confirmButtonText: 'OK'
            });
        }
    };

    const userInfo = getUserInfo();

    const dropdownVariants = {
        hidden: {
            opacity: 0,
            y: -10,
            scale: 0.95
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.2,
                ease: "easeOut"
            }
        },
        exit: {
            opacity: 0,
            y: -10,
            scale: 0.95,
            transition: {
                duration: 0.15,
                ease: "easeIn"
            }
        }
    };

    const modalVariants = {
        hidden: {
            opacity: 0,
            scale: 0.9
        },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        },
        exit: {
            opacity: 0,
            scale: 0.9,
            transition: {
                duration: 0.2,
                ease: "easeIn"
            }
        }
    };

    const overlayVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { duration: 0.2 }
        },
        exit: {
            opacity: 0,
            transition: { duration: 0.2 }
        }
    };

    if (!userInfo) {
        return (
            <motion.button
                onClick={() => navigate('/login')}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg 
                          font-medium hover:from-blue-600 hover:to-purple-700 transition-all 
                          shadow-lg hover:shadow-blue-500/25 relative overflow-hidden group"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
            >
                <span className="relative z-10">Login</span>
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500 opacity-0 group-hover:opacity-100"
                    transition={{ duration: 0.3 }}
                />
            </motion.button>
        );
    }

    return (
        <div className="relative">
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-3 text-white/90 hover:text-white transition-colors group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 
                              flex items-center justify-center shadow-lg shadow-purple-500/20 
                              relative overflow-hidden">
                    <span className="text-white text-lg font-semibold relative z-10">
                        {userInfo.email ? userInfo.email[0].toUpperCase() : 'U'}
                    </span>
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-500"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
                <span className="hidden md:inline font-medium">{userInfo.email}</span>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="absolute right-0 mt-3 w-64 bg-gradient-to-br from-blue-900/95 to-purple-900/95 
                                 backdrop-blur-xl rounded-xl shadow-xl py-2 border border-white/10"
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <motion.div
                            className="px-4 py-3 border-b border-white/10"
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <p className="font-medium text-white">{userInfo.email}</p>
                            <p className="text-sm text-white/60 capitalize">Role: {userInfo.role}</p>
                        </motion.div>

                        <motion.button
                            onClick={() => {
                                setIsOpen(false);
                                setIsChangePasswordOpen(true);
                            }}
                            className="w-full px-4 py-3 text-white/80 hover:text-white hover:bg-white/5 
                                     flex items-center gap-3 transition-all relative overflow-hidden group"
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                            whileHover={{ x: 5 }}
                        >
                            <Lock className="w-4 h-4" />
                            Change Password
                        </motion.button>

                        <motion.button
                            onClick={handleLogout}
                            className="w-full px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 
                                     flex items-center gap-3 transition-all relative overflow-hidden group"
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            whileHover={{ x: 5 }}
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isChangePasswordOpen && (
                    <motion.div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
                        variants={overlayVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <motion.div
                            className="bg-gradient-to-br from-blue-900/95 to-purple-900/95 backdrop-blur-xl 
                                      rounded-xl shadow-xl p-8 max-w-md w-full mx-4 space-y-6 border border-white/10"
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <div className="flex justify-between items-center">
                                <motion.h2
                                    className="text-xl font-semibold text-white"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    Change Password
                                </motion.h2>
                                <motion.button
                                    onClick={() => setIsChangePasswordOpen(false)}
                                    className="text-white/60 hover:text-white transition-colors"
                                    whileHover={{ rotate: 90 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <X className="w-5 h-5" />
                                </motion.button>
                            </div>

                            <motion.form
                                onSubmit={handlePasswordChange}
                                className="space-y-6"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                <div className="relative">
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        value={passwordData.password}
                                        onChange={(e) => setPasswordData(prev => ({
                                            ...prev,
                                            password: e.target.value
                                        }))}
                                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white
             focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all
             placeholder-white/40"
                                        placeholder="Enter new password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                                    >
                                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>

                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData(prev => ({
                                            ...prev,
                                            confirmPassword: e.target.value
                                        }))}
                                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white
             focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all
             placeholder-white/40"
                                        placeholder="Confirm new password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>

                                <div className="flex justify-end space-x-3">
                                    <motion.button
                                        type="button"
                                        onClick={() => setIsChangePasswordOpen(false)}
                                        className="px-4 py-2 text-white/90 bg-white/5 border border-white/10 rounded-lg
                                                 hover:bg-white/10 hover:text-white transition-all"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        type="submit"
                                        className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white 
                                                 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 
                                                 transition-all shadow-lg hover:shadow-blue-500/25"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        Change Password
                                    </motion.button>
                                </div>
                            </motion.form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AccountMenu;