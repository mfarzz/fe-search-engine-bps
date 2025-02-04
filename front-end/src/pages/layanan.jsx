import { useEffect, useState, useCallback } from "react";
import CardLayanan from "../components/CardLayanan";
import { exploreLink } from "../services/pencarianLink.service";
import Sidebar from "../components/SideBar";
import Footer from "../components/Footer";
import ScrollButton from "../components/ScrollButton";
import useRole from "../hooks/useRole";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "../components/Logo";
import Feedback from "../components/Feedback";

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

const CategoryButton = ({ category, isSelected, onClick }) => (
    <motion.button
        onClick={() => onClick(category)}
        className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300
                   ${isSelected
                ? 'bg-cyan-400/20 text-cyan-200 ring-2 ring-cyan-400/50'
                : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
    >
        {category}
    </motion.button>
);

const Layanan = () => {
    const role = useRole();
    const [cards, setCards] = useState([]);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const limit = 12;
    const [selectedCategory, setSelectedCategory] = useState("");
    const categories = ["IPDS", "Sosial", "Distribusi", "Produksi", "Neraca", "Umum"];

    const fetchCards = async (currentOffset = 0) => {
        try {
            setIsLoading(true);
            const response = await exploreLink(limit, currentOffset, selectedCategory);

            if (currentOffset === 0) {
                setCards(response.data);
            } else {
                setCards(prevCards => [...prevCards, ...response.data]);
            }

            setHasMore(response.hasMore);
        } catch (error) {
            console.error('Error fetching cards:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setOffset(0);
        fetchCards(0);
    }, [selectedCategory]);

    const handleCategoryClick = (category) => {
        setSelectedCategory(selectedCategory === category ? "" : category);
    };

    const handleScroll = useCallback(() => {
        const scrollHeight = document.documentElement.scrollHeight;
        const scrollTop = document.documentElement.scrollTop;
        const clientHeight = document.documentElement.clientHeight;

        if (!isLoading && hasMore && (scrollTop + clientHeight >= scrollHeight - 100)) {
            const newOffset = offset + limit;
            setOffset(newOffset);
            fetchCards(newOffset);
        }
    }, [offset, isLoading, hasMore]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    return (
        <div className="relative min-h-screen flex flex-col">
            <AnimatedBackground />

            <motion.div
                className="container mx-auto p-6 flex-grow relative z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {/* Logo Section */}
                <div className="flex flex-col items-center mb-3">
                    <Logo size="large" />
                </div>

                {/* Category Filter Section */}
                <motion.div
                    className="mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    <div className="flex flex-wrap justify-center gap-4 px-4">
                        {categories.map((category) => (
                            <CategoryButton
                                key={category}
                                category={category}
                                isSelected={selectedCategory === category}
                                onClick={handleCategoryClick}
                            />
                        ))}
                    </div>
                </motion.div>

                {/* Projects Section */}
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        visible: {
                            transition: {
                                staggerChildren: 0.1
                            }
                        }
                    }}
                >
                    <AnimatePresence mode="popLayout">
                        {cards.map((card) => (
                            <motion.div
                                key={card.id}
                                layout
                                variants={cardVariants}
                                className="backdrop-blur-md bg-white/5 rounded-xl
                                         hover:bg-white/20 transition-colors duration-300"
                            >
                                <CardLayanan
                                    id={card.id}
                                    judul={card.judul}
                                    gambar={card.gambar}
                                    link={card.url}
                                    deskripsi={card.deskripsi}
                                    email={card.User.email}
                                    updatedAt={new Date(card.updatedAt).toLocaleString()}
                                    kategori={card.kategori}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {isLoading && (
                    <motion.div
                        className="flex justify-center py-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="w-10 h-10 border-4 border-cyan-300 border-t-transparent
                                      rounded-full animate-spin" />
                    </motion.div>
                )}
            </motion.div>

            <div className="relative z-10">
                <Footer />
                <Sidebar role={role} />
                <ScrollButton />
                <Feedback />
            </div>
        </div>
    );
}

export default Layanan;