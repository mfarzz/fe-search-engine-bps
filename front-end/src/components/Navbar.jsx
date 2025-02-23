import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AccountMenu from './AccountMenu';

const Navbar = () => {
    const navigate = useNavigate();
    const handleClicked = () => {
        navigate('/home');
    }
    return (
        <header className="fixed top-0 left-0 w-full backdrop-blur-xl bg-blue-950/30 border-b border-white/10 shadow-lg z-40">
            <nav className="max-w-7xl mx-auto px-4 py-3">
                <div className="flex justify-between items-center">
                    <motion.div
                        className="flex items-center gap-4 focus:outline-none"
                        href="/home"
                        aria-label="Brand"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        onClick={handleClicked}
                    >
                        <motion.a
                            animate={{
                                rotate: 360
                            }}
                            transition={{
                                duration: 20,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                            className="relative w-10 h-10"
                        >
                            <img
                                src="/linkfy.png"
                                alt="Linkfy Logo"
                                className="w-full h-full brightness-150 contrast-125 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                            />
                            <div className="absolute inset-0 bg-cyan-400 opacity-20 blur-xl rounded-full -z-10" />
                        </motion.a>
                        <a href="/home">
                            <h1 className="text-2xl font-bold">
                                <span className="bg-gradient-to-r from-cyan-200 via-cyan-300 to-blue-200 
                                         bg-clip-text text-transparent 
                                         drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                                    Linkfy
                                </span>
                            </h1>
                        </a>
                    </motion.div>

                    {/* Account Menu */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <AccountMenu />
                    </motion.div>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;