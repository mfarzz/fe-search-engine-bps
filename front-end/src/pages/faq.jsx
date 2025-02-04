import { useState, useEffect } from "react";
import Navbar from "/src/components/Navbar";
import Sidebar from "/src/components/SideBar";
import Footer from "/src/components/Footer";
import Scroll from "/src/components/Scroll";
import Feedback from "/src/components/Feedback";
import Accordion from "/src/components/Accordion";
import { motion } from "framer-motion";
import useRole from "../hooks/useRole";

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

const pertanyaan = [
    {
        pertanyaan: "Apa itu Sistem Search Engine BPS Sumbar?",
        jawaban:
            "Sistem Search Engine BPS Sumbar adalah platform pencarian yang dirancang untuk mengakses semua link yang terkait dengan Badan Pusat Statistik (BPS) Sumatera Barat.",
    },
    {
        pertanyaan: "Apakah semua orang dapat menambahkan link ke dalam sistem?",
        jawaban:
            "Hanya pengguna yang telah terverifikasi dan memiliki akun resmi yang dapat menambahkan link.",
    },
    {
        pertanyaan: "Bagaimana cara mengakses sistem ini?",
        jawaban: "Kamu dapat mengakses sistem melalui situs resmi BPS Sumbar.",
    },
    {
        pertanyaan: "Apakah sistem ini hanya mencakup data dari BPS Sumbar?",
        jawaban:
            "Ya, sistem ini difokuskan untuk mengakses link yang berkaitan dengan BPS Sumatera Barat. Namun, jika ada data nasional yang relevan dengan Sumatera Barat, link tersebut juga dapat dimasukkan.",
    },
];

function FAQ() {
    const role = useRole();
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

    return (
        <div className="relative min-h-screen overflow-hidden">
            <AnimatedBackground />
            
            <div className="relative z-10">
                <Navbar />
                
                <motion.div 
                    className="max-w-2xl mx-auto text-center mb-10 lg:mb-14 mt-20 p-2"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <h2 className="text-2xl font-bold md:text-4xl md:leading-tight mt-12 text-white">
                        FAQ
                    </h2>
                    <p className="mt-1 text-gray-200">
                        Jawaban atas pertanyaan yang paling sering ditanyakan.
                    </p>
                </motion.div>

                <motion.div 
                    className="max-w-2xl mx-auto mb-10 px-4"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {pertanyaan.map((item, index) => (
                        <motion.div
                            key={index}
                            className="mb-4"
                            variants={containerVariants}
                        >
                            <div className="bg-white bg-opacity-10 rounded-lg backdrop-blur-sm">
                                <Accordion
                                    pertanyaan={item.pertanyaan}
                                    jawaban={item.jawaban}
                                />
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            <Sidebar role={role} />
            <Footer />
            <Feedback />
        </div>
    );
}

export default FAQ;