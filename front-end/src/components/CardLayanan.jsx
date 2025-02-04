import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { API_URL, klikLink } from '../services/pencarianLink.service';
import { motion } from 'framer-motion';

const CardLayanan = ({ id, gambar, judul, link, deskripsi, email, updatedAt, kategori }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 640);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (isTransitioning) {
            const timer = setTimeout(() => {
                setIsTransitioning(false);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [isTransitioning]);

    const handleToggle = (e) => {
        if (isMobile) return;
        e.stopPropagation();
        setIsTransitioning(true);
        setIsExpanded(!isExpanded);
    };

    const handleClick = async (e) => {
        if (e.target.closest('.expand-btn')) {
            return;
        }
        try {
            await klikLink(id);
            window.open(link, '_blank', 'noopener,noreferrer');
        } catch (error) {
            console.error('Error recording link click:', error);
            window.open(link, '_blank', 'noopener,noreferrer');
        }
    };

    const CategoryBadge = ({ kategori }) => (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-cyan-400/20 text-cyan-200 
                       ring-1 ring-cyan-400/30 backdrop-blur-sm">
            {kategori || 'Uncategorized'}
        </span>
    );

    if (isMobile) {
        return (
            <motion.div 
                onClick={handleClick}
                className="aspect-[4/3] rounded-xl backdrop-blur-md bg-opacity-10
                         transition-all duration-300 overflow-hidden cursor-pointer
                         flex flex-col relative"
            >
                {/* Category Badge - Absolute positioned on image */}
                <div className="absolute top-3 left-3 z-10">
                    <CategoryBadge kategori={kategori} />
                </div>

                <div className="relative h-3/4">
                    <img
                        src={gambar ? `${API_URL}${gambar}` : '/default-image.jpg'}
                        alt={judul}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="flex-1 p-3 flex items-center justify-between bg-opacity-10">
                    <h3 className="text-base font-semibold text-white/90 line-clamp-1">
                        {judul}
                    </h3>
                    <svg
                        className="w-5 h-5 text-cyan-300 transform transition-transform duration-300
                                 hover:translate-x-1 hover:-translate-y-1 flex-shrink-0 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div 
            onClick={handleClick}
            className="aspect-square rounded-xl backdrop-blur-md bg-opacity-10
                     transition-all duration-300 overflow-hidden cursor-pointer
                     flex flex-col"
        >
            <div className={`relative transition-all duration-500 ease-in-out 
                ${isExpanded ? 'h-0' : 'h-[45%]'}`}>
                {/* Category Badge - Absolute positioned on image */}
                <div className="absolute top-3 left-3 z-10">
                    <CategoryBadge kategori={kategori} />
                </div>
                <img
                    src={gambar ? `${API_URL}${gambar}` : '/default-image.jpg'}
                    alt={judul}
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="flex-1 p-4 flex flex-col">
                <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-white/90 line-clamp-1">
                        {judul}
                    </h3>
                    <svg
                        className="w-5 h-5 text-cyan-300 transform transition-transform duration-300
                                 hover:translate-x-1 hover:-translate-y-1 flex-shrink-0 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                </div>

                <div className="relative flex-1">
                    <div className={`text-white/70 text-sm transition-all duration-500
                        ${isExpanded ? 'max-h-[220px] overflow-y-auto' : 'max-h-[60px] overflow-hidden'}`}>
                        {deskripsi}
                    </div>
                    
                    <button
                        onClick={handleToggle}
                        className="expand-btn absolute bottom-0 left-0 text-cyan-300 hover:text-cyan-200 
                                 text-sm flex items-center gap-1 transition-colors duration-300
                                 bg-transparent"
                    >
                        {isExpanded ? 'Show Less' : 'Show More'}
                        <svg 
                            className="w-4 h-4"
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d={isExpanded ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                            />
                        </svg>
                    </button>
                </div>

                <div className="mt-3 pt-2 border-t border-white/20">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-white/60 truncate max-w-[150px]">
                            {email}
                        </span>
                        <span className="text-xs text-white/60">
                            {new Date(updatedAt).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

CardLayanan.propTypes = {
    id: PropTypes.string.isRequired,
    gambar: PropTypes.string,
    judul: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    deskripsi: PropTypes.string,
    email: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired,
    kategori: PropTypes.string,
};

export default CardLayanan;