import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import SearchBar from "../components/SearchBar";
import Logo from "../components/Logo";
import Sidebar from "../components/SideBar";
import useRole from "../hooks/useRole";
import Footer from "../components/Footer";
import AppIconGrid from "../components/AppIconGrid";
import { seringDikunjungi, terakhirDikunjungi } from "../services/riwayatLink.service";
import ExploreButton from "../components/Explore";
import Feedback from "../components/Feedback";
import { motion } from "framer-motion";
import SplashScreen from '../components/SplashScreen';
import AccountMenu from "../components/AccountMenu";

const AnimatedBackground = () => {
    const [nodes, setNodes] = useState([]);

    useEffect(() => {
        const createNode = () => ({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            size: Math.random() * 4 + 2,
        });

        setNodes(Array.from({ length: 30 }, createNode));

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
        <div className="fixed inset-0 bg-gradient-to-br from-blue-900 to-purple-900">
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
                            fill="rgba(255,255,255,0.5)"
                        />
                    </g>
                ))}
            </svg>
        </div>
    );
};

const Home = () => {
    const [search, setSearch] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const role = useRole();
    const [mostVisited, setMostVisited] = useState([]);
    const [lastVisited, setLastVisited] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [showSplash, setShowSplash] = useState(false);

    useEffect(() => {
        const isFirstVisit = !sessionStorage.getItem('hasVisited');
        const isPostLogin = sessionStorage.getItem('justLoggedIn');

        if (isFirstVisit || isPostLogin) {
            setShowSplash(true);
            const timer = setTimeout(() => {
                setShowSplash(false);
                sessionStorage.setItem('hasVisited', 'true');
                sessionStorage.removeItem('justLoggedIn');
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, []);

    const handleSearch = () => {
        if (search.trim() !== "") {
            const encodedSearch = encodeURIComponent(search).replace(/%20/g, '+');
            navigate(`/search?q=${encodedSearch}`);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4 }
        }
    };

    const getMostVisited = async () => {
        try {
            const result = await seringDikunjungi();
            setMostVisited(result.data);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    const getTerakhirDikunjungi = async () => {
        try {
            const result = await terakhirDikunjungi();
            setLastVisited(result.data);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    useEffect(() => {
        getMostVisited();
        getTerakhirDikunjungi();
        setIsLoaded(true);
    }, []);

    if (showSplash) {
        return <SplashScreen />;
    }

    return (
        <div className="relative min-h-screen overflow-hidden">
            <AnimatedBackground />

            {/* Header */}
            <header className="absolute top-0 left-0 right-0 z-40">
                <div className="flex justify-between items-center p-4">
                    <div className="w-10 h-10">
                        <Sidebar role={role} />
                    </div>
                    <AccountMenu setIsMenuOpen={setIsMenuOpen} isMenuOpen={isMenuOpen} />
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 flex flex-col items-center w-full h-full px-4 pt-10 pb-24">
                {/* Logo and Search */}
                <motion.div 
                    className="w-full max-w-2xl mx-auto mb-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    <Logo />
                    <div className="mt-6 z-20">
                        <SearchBar 
                            search={search} 
                            setSearch={setSearch} 
                            onSearch={handleSearch}
                            className="w-full"
                        />
                    </div>
                </motion.div>

                {/* Frequently Visited */}
                {mostVisited.length > 0 && (
                    <motion.section 
                        className="w-full mb-8"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <h2 className="text-white text-lg font-semibold mb-4 text-center">
                            Sering Dikunjungi
                        </h2>
                        <div className="flex justify-center gap-4 overflow-x-auto pb-4 px-4 no-scrollbar">
                            {mostVisited.map((item, index) => (
                                <motion.div
                                    key={index}
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <AppIconGrid
                                        id={item.id_link}
                                        judul={item.Link.judul}
                                        gambar={item.Link.gambar}
                                        url={item.Link.url}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>
                )}

                {/* Recently Visited */}
                {lastVisited.length > 0 && (
                    <motion.section 
                        className="w-full mb-8"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <h2 className="text-white text-lg font-semibold mb-4 text-center">
                            Terakhir Dikunjungi
                        </h2>
                        <div className="flex justify-center gap-4 overflow-x-auto pb-4 px-4 no-scrollbar">
                            {lastVisited.map((item, index) => (
                                <motion.div
                                    key={index}
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <AppIconGrid
                                        id={item.id_link}
                                        judul={item.Link.judul}
                                        gambar={item.Link.gambar}
                                        url={item.Link.url}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>
                )}

                {/* Explore Button */}
                <motion.div
                    className="fixed bottom-2 left-1/2 transform -translate-x-1/2 z-20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                >
                    <ExploreButton />
                </motion.div>
            </main>
            <Feedback />

            {/* Footer */}
            <motion.footer
                className="fixed bottom-0 w-full z-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
            >
                <Footer />
            </motion.footer>
        </div>
    );
};

export default Home;