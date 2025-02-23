import { motion } from 'framer-motion';

const SplashScreen = () => {
    const textVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { 
            opacity: 1, 
            y: 0,
            transition: {
                delay: 0.8,
                duration: 0.5
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-blue-950 via-indigo-900 to-blue-900 flex flex-col items-center justify-center overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <svg className="w-full h-full opacity-10" viewBox="0 0 100 100">
                    <defs>
                        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style={{ stopColor: '#60A5FA', stopOpacity: 1 }} />
                            <stop offset="100%" style={{ stopColor: '#3B82F6', stopOpacity: 1 }} />
                        </linearGradient>
                    </defs>
                    {Array.from({ length: 10 }).map((_, i) => (
                        <motion.circle
                            key={i}
                            cx={Math.random() * 100}
                            cy={Math.random() * 100}
                            r={Math.random() * 3 + 1}
                            fill="url(#grad1)"
                            initial={{ opacity: 0 }}
                            animate={{ 
                                opacity: [0.3, 0.7, 0.3],
                                scale: [1, 1.2, 1],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: i * 0.2,
                            }}
                        />
                    ))}
                </svg>
            </div>

            {/* Main logo animation */}
            <motion.div 
                className="relative w-32 h-32 mb-8"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ 
                    scale: 1,
                    rotate: 0,
                }}
                transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    duration: 1.5
                }}
            >
                <motion.div
                    animate={{ 
                        rotate: 360 
                    }}
                    transition={{ 
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="w-full h-full relative"
                >
                    <img
                        src="/linkfy.png"
                        alt="Linkfy Logo"
                        className="w-full h-full brightness-150 contrast-125 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                    />
                    {/* Glowing effect behind the logo */}
                    <div className="absolute inset-0 bg-cyan-400 opacity-20 blur-xl rounded-full -z-10" />
                </motion.div>
            </motion.div>

            {/* Text animations */}
            <motion.div
                className="text-center"
                variants={textVariants}
                initial="initial"
                animate="animate"
            >
                <h1 className="text-4xl font-bold">
                    <span className="bg-gradient-to-r from-cyan-200 via-cyan-300 to-blue-200 
                                   bg-clip-text text-transparent 
                                   drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                        Linkfy
                    </span>
                </h1>
                <p className="text-blue-200 mt-2 opacity-80">
                    Your Universal Link Hub
                </p>
            </motion.div>
        </div>
    );
};

export default SplashScreen;