import React from 'react';
import PropTypes from "prop-types";
import { API_URL } from "../services/riwayatLink.service";
import defautlImage from '/default.jpg';
import { klikLink } from "../services/pencarianLink.service";

const AppIconGrid = ({ id, judul, gambar, url }) => {
    const handleClick = async (e) => {
        try {
            e.preventDefault();
            await klikLink(id);
            window.open(url, '_blank', 'noopener,noreferrer');
            window.location.reload();
        } catch (error) {
            console.error('Error recording link click:', error);
        }
    };
    
    return (
        <div className="min-w-[120px] p-2"> {/* Reduced min-width for mobile */}
            <a
                href={url}
                onClick={handleClick}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer block"
            >
                <div className="flex flex-col items-center rounded-xl bg-white/10 backdrop-blur-md p-3 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-white/5 shadow-lg"> {/* Reduced icon size */}
                        {gambar ? (
                            <img
                                src={`${API_URL}${gambar}`}
                                alt={judul}
                                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                            />
                        ) : (
                            <img
                                src={defautlImage}
                                alt={judul}
                                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                            />
                        )}
                    </div>
                    <span className="text-xs text-white mt-2 text-center font-medium truncate max-w-[100px]">
                        {judul}
                    </span>
                </div>
            </a>
        </div>
    );
};

AppIconGrid.propTypes = {
    id: PropTypes.string.isRequired,
    judul: PropTypes.string.isRequired,
    gambar: PropTypes.string,
    url: PropTypes.string.isRequired
};

export default AppIconGrid;