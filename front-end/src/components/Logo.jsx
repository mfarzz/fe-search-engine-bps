import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const Logo = ({ size = 'large' }) => {
    const sizes = {
        large: {
            container: 'gap-6 mb-8',
            image: 'w-[4.5rem] h-[4.5rem]',
            text: 'text-4xl'
        },
        small: {
            container: 'gap-3',
            image: 'w-14 h-14',
            text: 'text-2xl'
        }
    };

    const handleClicked = () => {
        const navigate = useNavigate();
        navigate('/home');
    }


    const currentSize = sizes[size];

    return (
        <div className={`flex items-center justify-center ${currentSize.container}`}>
            <motion.div
                animate={{ 
                    rotate: 360 
                }}
                transition={{ 
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="relative"
                onClick={handleClicked}
            >
                <img 
                    src="src/assets/linkfy.png" 
                    alt="Linkfy Logo" 
                    className={`${currentSize.image} brightness-150 contrast-125 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]`}
                />
                {/* Glow effect behind the logo */}
                <div className="absolute inset-0 bg-cyan-400 opacity-20 blur-xl rounded-full -z-10" />
            </motion.div>
            <h1 className={`${currentSize.text} font-bold`}>
                <span className="bg-gradient-to-r from-cyan-200 via-cyan-300 to-blue-200 
                               bg-clip-text text-transparent 
                               drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]
                               filter backdrop-brightness-150">
                    Linkfy
                </span>
            </h1>
        </div>
    );
};

Logo.propTypes = {
    size: PropTypes.oneOf(['large', 'small'])
};

export default Logo;