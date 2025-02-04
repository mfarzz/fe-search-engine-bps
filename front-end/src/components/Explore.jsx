import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const ExploreButton = () => {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);

    return (
        <button
            onClick={() => navigate('/layanan')}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group relative bottom-20 left-1/2 transform -translate-x-1/2 z-20"
        >
            {/* Animated background glow effect */}
            <div className="absolute inset-0 bg-blue-500/30 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500 animate-pulse" />
            
            {/* Main button container */}
            <div className="relative flex items-center overflow-hidden rounded-full px-8 py-3
                bg-gradient-to-r from-blue-600 to-blue-500 
                hover:from-blue-500 hover:to-purple-500
                transition-all duration-300 shadow-lg 
                hover:shadow-blue-500/50 hover:shadow-xl
                border border-white/20">

                {/* Sliding background effect */}
                <div className="absolute inset-0 translate-y-full group-hover:translate-y-0
                    bg-gradient-to-r from-blue-500 to-purple-500 
                    transition-transform duration-500" />

                {/* Text content */}
                <span className="relative flex items-center gap-2 text-white font-semibold">
                    <span className="tracking-wide">Explore</span>
                    
                    {/* Animated arrow */}
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
                        className={`transform transition-transform duration-500
                            ${isHovered ? 'translate-x-1' : ''}`}
                    >
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                    </svg>
                </span>

                {/* Sparkle effects */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute top-1/2 left-1 w-1 h-1 bg-white rounded-full animate-ping" />
                    <div className="absolute top-1/2 right-2 w-1 h-1 bg-white rounded-full animate-ping delay-100" />
                    <div className="absolute bottom-1 left-1/2 w-1 h-1 bg-white rounded-full animate-ping delay-200" />
                </div>
            </div>
        </button>
    );
};

export default ExploreButton;