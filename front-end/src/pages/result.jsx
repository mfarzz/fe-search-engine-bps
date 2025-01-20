import CardResultSearch from "../components/CardResultSearch";
import { cariLink } from "../services/pencarianLink.service";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import { useNavigate } from 'react-router-dom';
import Footer from "../components/Footer";
import Sidebar from "../components/SideBar";
import useRole from "../hooks/useRole";
import ScrollButton from "../components/ScrollButton";
import Pagination from "../components/Pagination";
import PropTypes from "prop-types";

// Separate styles component
const AnimatedStyles = () => (
    <style>
        {`
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
            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
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
        `}
    </style>
);

const Result = () => {
    const role = useRole();
    const [data, setData] = useState([]);
    const [pageInfo, setPageInfo] = useState({
        currentPage: 1,
        totalPages: 1,
        totalResults: 0,
        limit: 5
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    const getQueryParams = (search) => {
        const params = new URLSearchParams(search);
        return params.get("q");
    };

    useEffect(() => {
        const query = getQueryParams(location.search);
        if (query) {
            setSearch(decodeURIComponent(query.replace(/\+/g, ' ')));
        }
    }, [location.search]);

    const handleSearch = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Silakan login terlebih dahulu.");
            return;
        }

        if (search.trim() !== "") {
            const encodedSearch = encodeURIComponent(search).replace(/%20/g, '+');
            navigate(`/search?q=${encodedSearch}`);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const query = getQueryParams(location.search);
                if (!query) {
                    setError("Query parameter 'q' tidak ditemukan.");
                    setIsLoading(false);
                    return;
                }
                const result = await cariLink({
                    query,
                    page: pageInfo.currentPage,
                    limit: pageInfo.limit
                });
                setData(result.data);
                setPageInfo({
                    ...pageInfo,
                    ...result.pagination // Updated to match the new API response structure
                });
            } catch (err) {
                setError(err.message || "Something went wrong");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [location.search, pageInfo.currentPage, pageInfo.limit]);

    const handlePageChange = (newPage) => {
        setPageInfo(prev => ({
            ...prev,
            currentPage: newPage
        }));
    };

    const LoadingSpinner = () => (
        <div className="flex justify-center items-center mt-20">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
        </div>
    );

    const ErrorMessage = ({ message }) => (
        <div className="text-center p-4 rounded-lg bg-white/80 backdrop-blur-sm shadow-lg">
            <div className="text-red-500">Error: {message}</div>
        </div>
    );

    const NoResults = () => (
        <div className="text-center p-8 rounded-lg bg-white/80 backdrop-blur-sm shadow-lg">
            <div className="text-6xl mb-4">🔍</div>
            <div className="text-xl text-gray-600 mb-2">No results found</div>
            <div className="text-gray-500">Try different keywords or refine your search</div>
        </div>
    );

    return (
        <div className="relative min-h-screen flex flex-col overflow-hidden">
            <AnimatedStyles />
            
            {/* Animated background */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 animate-gradient-slow"></div>
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
                    <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
                </div>
            </div>

            {/* Navbar */}
            <div className="fixed top-0 left-0 w-full bg-blue-premier text-sm py-3 shadow z-10">
                <div className="w-full px-4 md:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row items-center w-full gap-4">
                            <a
                                className="flex items-center gap-x-2 text-xl font-semibold text-white focus:outline-none focus:opacity-80"
                                href="/home"
                                aria-label="Brand"
                            >
                                <img src="src/assets/logo.png" alt="Logo" className="w-11 h-10 mr-1" />
                                <div className="grid grid-rows-2 grid-flow-col gap-0">
                                    <div className="text-lg md:text-xl italic font-bold">BADAN PUSAT STATISTIK</div>
                                    <div className="text-sm md:text-base italic font-bold">PROVINSI SUMATERA BARAT</div>
                                </div>
                            </a>

                            <div className="w-full md:w-96 lg:w-[500px]">
                                <SearchBar search={search} setSearch={setSearch} onSearch={handleSearch} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="min-h-screen flex justify-center items-start py-6 md:py-10 px-4 mt-32 md:mt-20 relative z-0">
                <div className="w-full max-w-5xl">
                    {isLoading ? (
                        <LoadingSpinner />
                    ) : error ? (
                        <ErrorMessage message={error} />
                    ) : data.length === 0 ? (
                        <NoResults />
                    ) : (
                        <div className="space-y-6">
                            {data.map((item, index) => (
                                <div
                                    key={`${item.id}-${index}`}
                                    className="transform transition-all duration-500"
                                    style={{
                                        opacity: 0,
                                        animation: `fadeIn 0.5s ease-out ${index * 0.1}s forwards`
                                    }}
                                >
                                    <CardResultSearch
                                        id={item.id.toString()}
                                        gambar={item.gambar}
                                        judul={item.judul}
                                        deskripsi={item.deskripsi}
                                        url={item.url}
                                        updatedAt={new Date(item.updatedAt).toLocaleString()}
                                        email={item.pembuat?.email || "Email tidak tersedia"}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Footer and Sidebar */}
            <div className="relative z-10">
                <Sidebar role={role} />
                {!isLoading && !error && data.length > 0 && (
                        <div className="mb-7 flex justify-center">
                            <Pagination
                                currentPage={pageInfo.currentPage}
                                totalPages={pageInfo.totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )}
                <Footer />
                <ScrollButton />
            </div>
        </div>
    );
};

Result.propTypes = {
    message: PropTypes.string
};

export default Result;