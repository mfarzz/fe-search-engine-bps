import { useNavigate } from 'react-router-dom';

const ExploreButton = () => {
    const navigate = useNavigate();
    return (
        <button
            onClick={() => navigate('/layanan')}
            className="fixed w-48 bottom-24 left-1/2 transform -translate-x-1/2 bg-blue-premier hover:bg-blue-500 text-white font-semibold py-2 px-8 rounded-full shadow-lg transition-all duration-300 z-20"
        >
            Explore
        </button>
    );
};

export default ExploreButton;