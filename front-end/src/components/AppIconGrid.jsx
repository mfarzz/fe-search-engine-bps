import PropTypes from "prop-types";
import { API_URL } from "../services/riwayatLink.service";
import defautlImage from '../assets/default.jpg';
import { klikLink } from "../services/pencarianLink.service";

const AppIconGrid = ({ id, judul, gambar, url }) => {
    const handleClick = async (e) => {
        try {
            e.preventDefault(); // Prevent immediate navigation
            await klikLink(id); // Record the click
            window.open(url, '_blank', 'noopener,noreferrer'); // Open in new tab after recording
            window.location.reload();
        } catch (error) {
            console.error('Error recording link click:', error);
        }
    };
    
    return (
        <div className="flex gap-4 p-4">
            <a
                href={url}
                onClick={handleClick}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer"
            >
                <div
                    className="flex flex-col items-center rounded-md group p-2 pl-4 pr-4 hover:bg-gray-500 transition-colors duration-300"
                >
                    <div className="w-16 h-16 rounded-full overflow-hidden group-hover:bg-gray-200 transition-colors duration-300">
                        {gambar ? (
                            <img
                                src={`${API_URL}${gambar}`}
                                alt={judul}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <img
                                src={defautlImage}
                                alt={judul}
                                className="w-full h-full object-cover"
                            />
                        )}
                    </div>
                    <span className="text-base text-white mt-1">{judul}</span>
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