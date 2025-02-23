import { memo, useState } from "react";
import PropTypes from 'prop-types';
import { API_URL, klikLink } from "../services/pencarianLink.service";
import defaultImage from '/default.jpg';
import { motion, AnimatePresence } from "framer-motion";

const CardResultSearch = memo(({ id, judul, deskripsi, url, gambar, updatedAt, email, kategori }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleClick = async (e) => {
        try {
            if (!e.target.closest('.expand-btn') && !e.target.closest('.description-text')) {
                e.preventDefault();
                await klikLink(id);
                window.open(url, '_blank', 'noopener,noreferrer');
            }
        } catch (error) {
            console.error('Error recording link click:', error);
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    };

    const toggleExpand = (e) => {
        e.stopPropagation();
        setIsExpanded(!isExpanded);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
        >
            <div 
                onClick={handleClick}
                className="group backdrop-blur-md bg-white/10 rounded-xl border border-white/20
                         hover:bg-white/20 transition-all duration-300 overflow-hidden
                         shadow-lg hover:shadow-xl cursor-pointer"
            >
                <div className="flex p-4 gap-4">
                    {/* Image Section with Category Badge */}
                    <div className="hidden md:block w-32 h-32 flex-shrink-0 overflow-hidden rounded-lg relative">
                        <div className="absolute top-2 left-2 z-10">
                            <span className="px-2 py-1 text-xs font-medium rounded-full 
                                         bg-cyan-400/20 text-cyan-200 ring-1 ring-cyan-400/30 
                                         backdrop-blur-sm">
                                {kategori || 'Uncategorized'}
                            </span>
                        </div>
                        <img
                            src={gambar ? `${API_URL}${gambar}` : defaultImage}
                            alt={judul}
                            className="w-full h-full object-cover transition-transform duration-300
                                     group-hover:scale-110"
                        />
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 min-w-0">
                        {/* Title, Category (mobile), and URL */}
                        <div className="mb-2">
                            <div className="flex items-center gap-2 mb-1">
                                <h2 className="text-xl font-bold text-white/90 
                                           group-hover:text-white transition-colors duration-300">
                                    {judul}
                                </h2>
                                {/* Show category badge for mobile */}
                                <div className="md:hidden">
                                    <span className="px-2 py-1 text-xs font-medium rounded-full 
                                                 bg-cyan-400/20 text-cyan-200 ring-1 ring-cyan-400/30">
                                        {kategori || 'Uncategorized'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 opacity-60 group-hover:opacity-80">
                                <svg 
                                    className="w-4 h-4 text-cyan-300" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" 
                                    />
                                </svg>
                                <span className="text-white/70 text-sm truncate hover:text-white/90">
                                    {url}
                                </span>
                            </div>
                        </div>

                        {/* Description with proper padding */}
                        <div className="relative description-text mb-6">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={isExpanded ? 'expanded' : 'collapsed'}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className={`text-white/60 text-sm pr-24 ${isExpanded ? '' : 'line-clamp-2'}`}
                                >
                                    {deskripsi}
                                </motion.div>
                            </AnimatePresence>
                            <button
                                onClick={toggleExpand}
                                className="expand-btn absolute bottom-0 right-0 text-cyan-300 hover:text-cyan-200 
                                         text-sm font-medium bg-gradient-to-l 
                                         to-transparent pl-4 py-0.5"
                            >
                                {isExpanded ? 'Show less' : 'Show more'}
                            </button>
                        </div>

                        {/* Metadata */}
                        <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 
                                             flex items-center justify-center text-white text-sm">
                                    {email[0].toUpperCase()}
                                </div>
                                <div className="text-xs">
                                    <span className="text-white/50">Created by </span>
                                    <span className="text-white/70">{email}</span>
                                </div>
                            </div>
                            <div className="flex items-center text-xs text-white/50">
                                <svg 
                                    className="w-4 h-4 mr-1 text-cyan-300/50" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
                                    />
                                </svg>
                                {updatedAt}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
});

CardResultSearch.propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    judul: PropTypes.string.isRequired,
    deskripsi: PropTypes.string,
    url: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    gambar: PropTypes.string,
    kategori: PropTypes.string
};

CardResultSearch.displayName = 'CardResultSearch';

export default CardResultSearch;