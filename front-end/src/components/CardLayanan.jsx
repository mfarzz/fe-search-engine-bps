import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { API_URL, klikLink } from '../services/pencarianLink.service';

const CardLayanan = ({ id, gambar, judul, link, deskripsi, email, updatedAt }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (isTransitioning) {
            const timer = setTimeout(() => {
                setIsTransitioning(false);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [isTransitioning]);

    const handleToggle = () => {
        setIsTransitioning(true);
        setIsExpanded(!isExpanded);
    };

    const handleClick = async (e) => {
        if (e.target.closest('.expand-btn')) {
            e.preventDefault();
            return;
        }
        try {
            e.preventDefault();
            await klikLink(id);
            window.open(link, '_blank', 'noopener,noreferrer');
        } catch (error) {
            console.error('Error recording link click:', error);
            window.open(link, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <div 
            className={`group aspect-square rounded-xl overflow-hidden
                transition-all duration-300 ease-out transform hover:-translate-y-2
                ${isHovered ? 'shadow-2xl scale-[1.02]' : 'shadow-lg'}
                bg-gradient-to-br from-white/90 to-white/80
                border border-white/20`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ display: 'flex', flexDirection: 'column' }}
        >
            {/* Image Container */}
            <div 
                className={`relative transition-all duration-500 ease-in-out 
                    ${isExpanded ? 'h-0' : 'h-2/5'}`}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
                <img
                    src={`${API_URL}${gambar}`}
                    alt={judul}
                    className="object-cover w-full h-full transition-all duration-500
                        group-hover:scale-110 group-hover:rotate-1"
                />
            </div>

            {/* Content Container */}
            <div className="flex flex-col flex-grow relative">
                {/* Title and Link */}
                <div className="p-4 flex items-start justify-between">
                    <h2 className="text-lg font-bold text-gray-800 line-clamp-1 
                        group-hover:text-blue-600 transition-colors duration-300">
                        {judul}
                    </h2>
                    {link && (
                        <a
                            onClick={handleClick}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative p-2 text-blue-600 hover:text-blue-800 ml-2 flex-shrink-0
                                transition-transform duration-300 hover:scale-110"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="relative z-10"
                            >
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                <polyline points="15 3 21 3 21 9" />
                                <line x1="10" y1="14" x2="21" y2="3" />
                            </svg>
                        </a>
                    )}
                </div>

                {/* Description Section */}
                <div className="relative flex-grow px-4 min-h-0">
                    <div 
                        className={`text-gray-600 text-sm transition-all duration-500 ease-in-out
                            ${isExpanded ? 'flex-grow min-h-0' : 'h-16'} 
                            ${isExpanded && !isTransitioning ? 'overflow-y-auto' : 'overflow-hidden'}`}
                    >
                        <div className="whitespace-pre-wrap pb-8">
                            {deskripsi}
                        </div>
                    </div>

                    {/* Gradient Overlay */}
                    {!isExpanded && (
                        <div className="absolute bottom-0 left-0 right-0 h-16 
                            bg-gradient-to-t from-white via-white/80 to-transparent 
                            pointer-events-none" />
                    )}

                    {/* Show More/Less Button */}
                    <button
                        onClick={handleToggle}
                        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 
                            text-blue-500 hover:text-blue-700 text-sm font-medium 
                            flex items-center gap-1 py-1 px-3 rounded-full
                            hover:bg-blue-50 transition-colors duration-300"
                    >
                        {isExpanded ? (
                            <>
                                Show Less
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    width="16" 
                                    height="16" 
                                    viewBox="0 0 24 24" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    strokeWidth="2" 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round"
                                >
                                    <path d="m18 15-6-6-6 6"/>
                                </svg>
                            </>
                        ) : (
                            <>
                                Show More
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    width="16" 
                                    height="16" 
                                    viewBox="0 0 24 24" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    strokeWidth="2" 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round"
                                >
                                    <path d="m6 9 6 6 6-6"/>
                                </svg>
                            </>
                        )}
                    </button>
                </div>

                {/* Footer */}
                <div className="p-4 mt-auto border-t border-gray-100">
                    <div className="w-full text-xs text-gray-500">
                        <div className="flex flex-col space-y-1">
                            <span className="line-clamp-1">
                                Created by: {email}
                            </span>
                            <span className="line-clamp-1">
                                Last modified: {updatedAt}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

CardLayanan.propTypes = {
    gambar: PropTypes.string,
    judul: PropTypes.string,
    link: PropTypes.string,
    deskripsi: PropTypes.string,
    email: PropTypes.string,
    updatedAt: PropTypes.string,
    id: PropTypes.string,
};

export default CardLayanan;