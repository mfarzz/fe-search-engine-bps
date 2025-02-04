import { ArrowUp } from "lucide-react";
import useScrollToTop from "../hooks/useScrollTop";
import { motion } from "framer-motion"; // Tambahkan import motion

const ScrollButton = () => {
    const { scrollToTop } = useScrollToTop();

    return (
        <motion.button
            onClick={scrollToTop}
            className="fixed bottom-3 right-4 z-20 p-3 bg-gradient-to-r from-blue-600 to-purple-600 
                     text-white rounded-full hover:from-blue-700 hover:to-purple-700 
                     shadow-lg backdrop-blur-sm transition-all duration-300 
                     border border-white/20"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
        >
            <ArrowUp size={25} className="w-8 h-8" />
        </motion.button>
    );
};

export default ScrollButton;