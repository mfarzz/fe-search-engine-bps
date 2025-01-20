import { memo, useState } from "react";
import PropTypes from 'prop-types';
import { API_URL, klikLink } from "../services/pencarianLink.service";
import defaultImage from '../assets/default.jpg';

const CardResultSearch = memo(({ id, judul, deskripsi, url, gambar, updatedAt, email }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleClick = async (e) => {
        if (e.target.closest('.expand-btn')) {
            e.preventDefault();
            return;
        }

        try {
            e.preventDefault();
            await klikLink(id);
            window.open(url, '_blank', 'noopener,noreferrer');
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
        <div className="transform transition-all duration-300 hover:scale-[1.02]">
            <div 
                onClick={handleClick}
                className={`group max-w-5xl bg-white rounded-3xl shadow-lg hover:shadow-xl 
                    transition-all duration-500 overflow-hidden relative
                    ${isExpanded ? 'h-auto min-h-[210px]' : 'h-[210px]'}`}
            >
                <div className="flex relative">
                    {/* Content Section */}
                    <div className={`relative flex-1 p-6 transition-all duration-500 ease-out
                        ${isExpanded ? 'pr-6' : 'pr-[288px]'}`}>
                        {/* Title and URL section */}
                        <div className="mb-4">
                            <h2 className="text-xl md:text-2xl font-bold mb-2 
                                bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent
                                group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                                {judul}
                            </h2>
                            
                            <div className="flex items-center gap-2">
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    className="h-4 w-4 text-blue-500 group-hover:text-purple-500 transition-colors duration-300" 
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" 
                                    />
                                </svg>
                                <span className="text-gray-500 group-hover:text-blue-500 text-sm transition-colors duration-300 truncate">
                                    {url}
                                </span>
                            </div>
                        </div>

                        {/* Description section */}
                        <div className="relative">
                            <div className={`text-gray-600 text-base transition-all duration-500 ease-out pe-20
                                ${isExpanded ? '' : 'line-clamp-1'}`}>
                                {deskripsi}
                            </div>
                        </div>

                        {/* Metadata Section */}
                        <div className={`mt-4 transition-all duration-500 ease-out transform
                            ${isExpanded ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
                            <div className="border-t border-gray-100 pt-4">
                                <div className="flex flex-col md:flex-row md:justify-between space-y-2 md:space-y-0">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 
                                            flex items-center justify-center text-white text-sm">
                                            {email[0].toUpperCase()}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm text-gray-600">Created by</span>
                                            <span className="text-sm font-medium text-gray-800">{email}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center text-sm text-gray-500">
                                        <svg 
                                            xmlns="http://www.w3.org/2000/svg" 
                                            className="h-4 w-4 mr-1" 
                                            fill="none" viewBox="0 0 24 24" stroke="currentColor"
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

                    {/* See More/Less Button */}
                    <button
                        onClick={toggleExpand}
                        className={`expand-btn absolute text-sm text-blue-500 hover:text-blue-700 font-medium
                            transition-all duration-300 hover:bg-blue-50 rounded-lg 
                            flex items-center gap-1 px-2 py-0.5 z-10
                            ${isExpanded ? 'right-6' : 'right-[272px]'} top-[84px]`}
                    >
                        {isExpanded ? 'See Less' : 'See More'}
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-4 w-4"
                            fill="none" viewBox="0 0 24 24" stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                d={isExpanded ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} 
                            />
                        </svg>
                    </button>

                    {/* Image Section */}
                    <div className={`absolute top-0 right-0 w-40 md:w-64 h-full transition-all duration-500 ease-out transform
                        ${isExpanded ? 'translate-x-full' : 'translate-x-0'}`}>
                        <img
                            src={gambar ? `${API_URL}${gambar}` : defaultImage}
                            alt={judul}
                            className="w-full h-full object-cover
                                transition-transform duration-700 ease-out group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10 
                            group-hover:opacity-0 transition-opacity duration-300" />
                    </div>
                </div>
            </div>
        </div>
    );
});

CardResultSearch.propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    judul: PropTypes.string.isRequired,
    deskripsi: PropTypes.string,
    url: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    gambar: PropTypes.string
};

CardResultSearch.displayName = 'CardResultSearch';

export default CardResultSearch;