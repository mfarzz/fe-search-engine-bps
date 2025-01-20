import SearchBar from "../components/SearchBar";
import Logo from "../components/Logo";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Sidebar from "../components/SideBar";
import useRole from "../hooks/useRole";
import Footer from "../components/Footer";
import AppIconGrid from "../components/AppIconGrid";
import { seringDikunjungi, terakhirDikunjungi } from "../services/riwayatLink.service";
import ExploreButton from "../components/Explore";
import { motion } from "framer-motion";

const Home = () => {
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    const videoBackground = "src/assets/tes.mp4";
    const role = useRole();
    const [mostVisited, setMostVisited] = useState([]);
    const [lastVisited, setLastVisited] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    const handleSearch = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Silakan login terlebih dahulu.");
            return;
        }

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

    return (
        <div className="relative h-screen overflow-hidden">
            {/* Video background dengan pencegahan download */}
            <div className="absolute top-0 left-0 w-full h-full">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    disablePictureInPicture
                    controlsList="nodownload"
                    className="w-full h-full object-cover"
                    style={{ pointerEvents: 'none' }}
                    onContextMenu={(e) => e.preventDefault()}
                >
                    <source src={videoBackground} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                <div className="absolute inset-0 bg-black bg-opacity-40" /> {/* Overlay untuk meningkatkan keterbacaan */}
            </div>

            {/* Content dengan animasi */}
            <motion.div
                className="relative z-10 items-center justify-center h-full mt-10 pr-4 pl-4 min-w-max"
                initial="hidden"
                animate={isLoaded ? "visible" : "hidden"}
                variants={containerVariants}
            >
                <motion.div variants={itemVariants}>
                    <Logo />
                </motion.div>
            
                <SearchBar search={search} setSearch={setSearch} onSearch={handleSearch} />

                {/* Container for both sections with animations */}
                <motion.div 
                    className="flex flex-col items-center mt-8 space-y-8"
                    variants={containerVariants}
                >
                    {/* Most Visited Section */}
                    {mostVisited.length > 0 && (
                        <motion.div 
                            className="flex flex-col items-center"
                            variants={itemVariants}
                        >
                            <h1 className="text-white text-lg mb-4 font-semibold">Sering Dikunjungi</h1>
                            <motion.div 
                                className="flex space-x-4"
                                variants={containerVariants}
                            >
                                {mostVisited.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        variants={itemVariants}
                                        whileHover={{ 
                                            scale: 1.05,
                                            transition: { type: "spring", stiffness: 300 }
                                        }}
                                    >
                                        <AppIconGrid
                                            id={item.id_link}
                                            judul={item.Link.judul}
                                            gambar={item.Link.gambar}
                                            url={item.Link.url}
                                        />
                                    </motion.div>
                                ))}
                            </motion.div>
                        </motion.div>
                    )}

                    {/* Last Visited Section */}
                    {lastVisited.length > 0 && (
                        <motion.div 
                            className="flex flex-col items-center"
                            variants={itemVariants}
                        >
                            <h1 className="text-white text-lg mb-4 font-semibold">Terakhir Dikunjungi</h1>
                            <motion.div 
                                className="flex space-x-4"
                                variants={containerVariants}
                            >
                                {lastVisited.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        variants={itemVariants}
                                        whileHover={{ 
                                            scale: 1.05,
                                            transition: { type: "spring", stiffness: 300 }
                                        }}
                                    >
                                        <AppIconGrid
                                            id={item.id_link}
                                            judul={item.Link.judul}
                                            gambar={item.Link.gambar}
                                            url={item.Link.url}
                                        />
                                    </motion.div>
                                ))}
                            </motion.div>
                        </motion.div>
                    )}
                </motion.div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
            >
                <ExploreButton />
            </motion.div>

            <motion.div 
                className="absolute bottom-0 w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
            >
                <Footer className="text-white" />
            </motion.div>
            
            <Sidebar role={role} />
        </div>
    );
};

export default Home;