import { useEffect, useState, useCallback } from "react";
import CardLayanan from "../components/CardLayanan";
import { exploreLink } from "../services/pencarianLink.service";
import Sidebar from "../components/SideBar";
import Footer from "../components/Footer";
import ScrollButton from "../components/ScrollButton";
import useRole from "../hooks/useRole";

const Layanan = () => {
    const role = useRole();
    const [cards, setCards] = useState([]);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [animatedCards, setAnimatedCards] = useState([]);
    const limit = 12;

    useEffect(() => {
        setIsVisible(true);
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setAnimatedCards(cards.map((_, index) => index));
        }, 100);

        return () => clearTimeout(timeout);
    }, [cards]);

    const fetchCards = async (currentOffset = 0) => {
        try {
            setIsLoading(true);
            const response = await exploreLink(limit, currentOffset);

            if (currentOffset === 0) {
                setCards(response.data);
            } else {
                setCards(prevCards => [...prevCards, ...response.data]);
            }

            setHasMore(response.hasMore);
        } catch (error) {
            console.error('Error fetching cards:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCards();
    }, []);

    const handleScroll = useCallback(() => {
        const scrollHeight = document.documentElement.scrollHeight;
        const scrollTop = document.documentElement.scrollTop;
        const clientHeight = document.documentElement.clientHeight;

        if (!isLoading && hasMore && (scrollTop + clientHeight >= scrollHeight - 100)) {
            const newOffset = offset + limit;
            setOffset(newOffset);
            fetchCards(newOffset);
        }
    }, [offset, isLoading, hasMore, limit]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    return (
        <div className="relative min-h-screen flex flex-col overflow-hidden">
            {/* Animated background */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 animate-gradient-slow"></div>
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
                    <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
                </div>
            </div>

            <div className="container mx-auto p-6 flex-grow relative z-10">
                <h1 
                    className={`text-3xl font-bold mb-8 transform transition-all duration-1000 ease-out
                        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                >
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Projects Gallery
                    </span>
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {cards.map((card, index) => (
                        <div
                            key={card.id}
                            className={`transform transition-all duration-700 ease-out backdrop-blur-sm bg-white/30 rounded-lg
                                ${animatedCards.includes(index) 
                                    ? 'translate-y-0 opacity-100' 
                                    : 'translate-y-8 opacity-0'}`}
                            style={{
                                transitionDelay: `${index * 100}ms`
                            }}
                        >
                            <CardLayanan
                                id={card.id}
                                judul={card.judul}
                                gambar={card.gambar}
                                link={card.url}
                                deskripsi={card.deskripsi}
                                email={card.User.email}
                                updatedAt={new Date(card.updatedAt).toLocaleString()}
                            />
                        </div>
                    ))}
                </div>
                {isLoading && (
                    <div className="text-center py-4">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                    </div>
                )}
            </div>

            <div className="w-full relative z-10">
                <Footer />
                <Sidebar role={role} />
            </div>
            <ScrollButton />

            <style>{`
                @keyframes gradient {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-gradient-slow {
                    animation: gradient 15s ease infinite;
                    background-size: 400% 400%;
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </div>
    );
}

export default Layanan;