import { memo } from "react";
import PropTypes from 'prop-types';
import { API_URL, klikLink } from "../services/pencarianLink.service";
import defaultImage from '../assets/default.jpg';

const CardResultSearch = memo(({ id, judul, deskripsi, url, gambar, updatedAt, email }) => {
    const handleClick = async (e) => {
        try {
            e.preventDefault(); // Prevent immediate navigation
            await klikLink(id); // Record the click
            window.open(url, '_blank', 'noopener,noreferrer'); // Open in new tab after recording
        } catch (error) {
            console.error('Error recording link click:', error);
            // Still open the link even if tracking fails
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <div>
            <div 
                onClick={handleClick}
                className="max-w-5xl bg-gray-100 rounded-[24px] shadow-sm hover:shadow-md transition-shadow duration-300 flex justify-between cursor-pointer"
            >
                {/* Content Section */}
                <div className="flex-1 py-6 px-6">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-1 truncate">
                        {judul}
                    </h2>
                    <span
                        className="text-gray-500 hover:text-blue-500 text-xs md:text-sm mb-3 block truncate"
                    >
                        {url}
                    </span>
                    {deskripsi && (
                        <p className="text-gray-600 text-xs md:text-base line-clamp-2 h-[3rem]">
                            {deskripsi}
                        </p>
                    )}
                    {/* Metadata Section */}
                    <div className="flex flex-col md:flex-row md:justify-between mt-4">
                        <div className="flex items-center text-xs md:text-sm text-gray-600">
                            <span>Created By : </span>
                            <span className="ml-1">{email}</span>
                        </div>
                        <div className="text-xs md:text-sm text-gray-600 mt-1 md:mt-0">
                            {updatedAt}
                        </div>
                    </div>
                </div>
                {/* Image Section */}
                {gambar ? (
                    <div className="w-40 min-w-[96px] max-w-[256px] md:w-64 flex-shrink-0">
                        <img
                            src={`${API_URL}${gambar}`}
                            alt={judul}
                            className="w-full h-[210px] object-cover rounded-r-[24px] min-h-[120px]"
                        />
                    </div>
                ) : (
                    <div className="w-40 min-w-[96px] max-w-[256px] md:w-64 flex-shrink-0">
                        <img
                            src={defaultImage}
                            alt={judul}
                            className="w-full h-[210px] object-cover rounded-r-[24px] min-h-[120px]"
                        />
                    </div>
                )}
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