import {
    Menu, X, Home, User, ChartColumnBig, Link, TableOfContents, ChevronLeft, Globe, LogOut
} from "lucide-react";
import { useState } from "react";
import useSidebar from "../hooks/useSidebar";
import PropTypes from "prop-types";
import { logout } from "../services/auth.service";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ role }) => {
    const { isOpen, toggleSidebar } = useSidebar();
    const [hoveredItem, setHoveredItem] = useState(null);
    const navigate = useNavigate();
    const [activeItem, setActiveItem] = useState(null);

    const handleLogout = async () => {
        try {
            await logout();
            sessionStorage.setItem('justLoggedIn', 'true');
            if (window.location.pathname === '/home') {
                window.location.reload();
            } else {
                navigate('/home');
            }
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const adminMenuItems = [
        { title: "Home", icon: Home, route: "/home" },
        { title: "Dashboard", icon: ChartColumnBig, route: "/dashboard" },
        { title: "Manajemen Link", icon: Link, route: "/link" },
        { title: "Akun User", icon: User, route: "/user" },
        { title: "Layanan", icon: Globe, route: "/layanan" },
        { title: "FAQ", icon: TableOfContents, route: "/faq" },
    ];

    const userMenuItems = [
        { title: "Home", icon: Home, route: "/home" },
        { title: "Manajemen Link", icon: Link, route: "/link" },
        { title: "FAQ", icon: TableOfContents, route: "/faq" },
        { title: "Layanan", icon: Globe, route: "/layanan" },
    ];

    const umumMenuItems = [
        { title: "Home", icon: Home, route: "/home" },
        { title: "FAQ", icon: TableOfContents, route: "/faq" },
        { title: "Layanan", icon: Globe, route: "/layanan" },
    ];

    const getMenuItems = (role) => {
        const logoutItem = {
            title: "Logout",
            icon: LogOut,
            onClick: handleLogout,
            className: "text-white hover:bg-red-500/20"
        };

        let items;
        switch (role) {
            case "admin":
                items = adminMenuItems;
                break;
            case "user":
                items = userMenuItems;
                break;
            case "umum":
            default:
                items = umumMenuItems;
        }

        // Only add logout if not "umum" role
        return role === "umum" || role === "admin" || role === "user" ? [...items, logoutItem] : items;
    };

    const menuItems = getMenuItems(role);

    const sidebarVariants = {
        open: {
            x: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30
            }
        },
        closed: {
            x: "-100%",
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30
            }
        }
    };

    const menuItemVariants = {
        hidden: {
            opacity: 0,
            x: -20
        },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.2
            }
        }
    };

    return (
        <div>
            <motion.button
                onClick={toggleSidebar}
                className="fixed top-4 left-4 z-50 p-2 backdrop-blur-md bg-opacity-20 bg-white text-white rounded-lg 
                          hover:bg-opacity-30 transition-all duration-300 shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40"
                        onClick={toggleSidebar}
                    />
                )}
            </AnimatePresence>

            <motion.div
                className="fixed top-0 left-0 h-screen w-72 backdrop-blur-xl bg-white/10 shadow-lg z-50 
                           flex flex-col border-r border-white/20"
                variants={sidebarVariants}
                initial="closed"
                animate={isOpen ? "open" : "closed"}
            >
                <div className="pl-5 pt-4 flex items-center justify-between">
                    <motion.button
                        onClick={toggleSidebar}
                        className="flex items-center p-2 rounded-lg text-white hover:bg-white/50 transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <ChevronLeft />
                    </motion.button>
                </div>

                <div className="h-full overflow-y-auto pl-7 flex flex-col">
                    <motion.h2
                        className="text-2xl font-bold mb-6 mt-12"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="grid grid-cols-[auto,1fr] gap-4 items-center">
                            <motion.div
                                className="w-12"
                                animate={{
                                    rotate: 360
                                }}
                                transition={{
                                    duration: 20,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                            >
                                <img
                                    src="/linkfy.png"
                                    alt="Logo Linkfy"
                                    className="w-full h-auto brightness-150 contrast-125 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                                />
                            </motion.div>
                            <div className="text-3xl font-bold">
                                <span className="bg-gradient-to-r from-cyan-200 via-cyan-300 to-blue-200 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] filter backdrop-brightness-150">
                                    Linkfy
                                </span>
                            </div>
                        </div>
                    </motion.h2>

                    <nav className="flex-1 flex flex-col">
                        <motion.ul className="space-y-2 flex-1 flex flex-col">
                            {menuItems.map((item, index) => {
                                const Icon = item.icon;
                                const isLastItem = index === menuItems.length - 1;
                                const itemClasses = `flex items-center gap-4 p-3 text-white rounded-lg transition-all duration-300 w-[90%] relative overflow-hidden ${item.className || 'hover:bg-white/20'
                                    } ${isLastItem ? 'mt-auto mb-6' : ''} ${activeItem === index ? 'bg-blue-500' : ''
                                    }`;

                                return (
                                    <motion.li
                                        key={index}
                                        variants={menuItemVariants}
                                        initial="hidden"
                                        animate="visible"
                                        transition={{ delay: index * 0.1 }}
                                        onHoverStart={() => setHoveredItem(index)}
                                        onHoverEnd={() => setHoveredItem(null)}
                                        className={isLastItem ? 'mt-auto' : ''}
                                    >
                                        {item.onClick ? (
                                            <button
                                                onClick={item.onClick}
                                                className={itemClasses}
                                            >
                                                {hoveredItem === index && (
                                                    <motion.div
                                                        className="absolute inset-0 bg-white/10"
                                                        layoutId="hoverBackground"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        transition={{ duration: 0.2 }}
                                                    />
                                                )}
                                                <Icon className="w-5 h-5 relative z-10" />
                                                <span className="relative z-10">{item.title}</span>
                                            </button>
                                        ) : (
                                            <a
                                                href={item.route}
                                                className={itemClasses}
                                            >
                                                {hoveredItem === index && (
                                                    <motion.div
                                                        className="absolute inset-0 bg-white/10"
                                                        layoutId="hoverBackground"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        transition={{ duration: 0.2 }}
                                                    />
                                                )}
                                                <Icon className="w-5 h-5 relative z-10" />
                                                <span className="relative z-10">{item.title}</span>
                                            </a>
                                        )}
                                    </motion.li>
                                );
                            })}
                        </motion.ul>
                    </nav>
                </div>
            </motion.div>
        </div>
    );
};

Sidebar.propTypes = {
    role: PropTypes.string.isRequired
};

export default Sidebar;