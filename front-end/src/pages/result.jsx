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
import { motion } from "framer-motion";
import Logo from "../components/Logo";
import Feedback from "../components/Feedback";

const Result = () => {
    const role = useRole();
    const [data, setData] = useState([]);
    const [pageInfo, setPageInfo] = useState({
        currentPage: 1,
        totalPages: 1,
        totalResults: 0,
        limit: 5,
        hasNextPage: false,
        hasPrevPage: false
    });
    const [metadata, setMetadata] = useState({
        searchTerms: [],
        queryVector: {}
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
                    return;
                }

                const result = await cariLink({
                    query,
                    page: pageInfo.currentPage,
                    limit: pageInfo.limit
                });

                if (result.status) {
                    setData(result.data);
                    setPageInfo(result.pagination);
                    setMetadata(result.metadata);
                } else {
                    setError(result.message);
                }
            } catch (err) {
                setError(err.message || "Terjadi kesalahan pada server");
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
        <div className="text-center p-4 rounded-lg bg-white/10 backdrop-blur-md shadow-lg border border-white/20">
            <div className="text-red-400">Error: {message}</div>
        </div>
    );

    const NoResults = () => (
        <div className="text-center p-8 rounded-lg bg-white/10 backdrop-blur-md shadow-lg border border-white/20">
            <div className="text-6xl mb-4">🔍</div>
            <div className="text-xl text-white/80 mb-2">
                {metadata.searchTerms.length > 0 ? (
                    <>
                        <div>No results found for search terms:</div>
                        <div className="text-sm text-white/60 mt-2">
                            {metadata.searchTerms.join(', ')}
                        </div>
                    </>
                ) : (
                    'No results found'
                )}
            </div>
            <div className="text-white/60">Try different keywords or refine your search</div>
        </div>
    );

    return (
        <div className="relative min-h-screen flex flex-col">
            {/* Animated Background */}
            <div className="fixed inset-0 bg-gradient-to-br from-blue-950 via-indigo-900 to-blue-900 -z-20" />

            {/* Animated nodes background */}
            <div className="fixed inset-0 -z-10">
                <svg className="w-full h-full opacity-30">
                    {Array.from({ length: 20 }).map((_, i) => (
                        <motion.circle
                            key={i}
                            cx={`${Math.random() * 100}%`}
                            cy={`${Math.random() * 100}%`}
                            r="2"
                            fill="#fff"
                            animate={{
                                opacity: [0.3, 0.8, 0.3],
                                scale: [1, 1.2, 1],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                delay: i * 0.2,
                            }}
                        />
                    ))}
                </svg>
            </div>

            {/* Main Content */}
            <div className="flex-grow flex flex-col items-center pt-6 px-4">
                {/* Search Bar Section */}
                <div className="w-full flex flex-col md:flex-row items-center justify-between px-4 py-4 md:py-2 max-w-4xl mb-6">
                    {/* Logo */}
                    <div
                        className="flex-shrink-0 cursor-pointer mb-4 md:mb-0"
                        onClick={() => navigate('/')}
                    >
                        <Logo size="small" />
                    </div>

                    {/* Search Bar */}
                    <div className="w-full md:w-[800px] z-20">
                        <SearchBar
                            search={search}
                            setSearch={setSearch}
                            onSearch={handleSearch}
                        />
                    </div>
                </div>

                {/* Results Section */}
                <div className="w-full max-w-4xl">
                    {isLoading ? (
                        <LoadingSpinner />
                    ) : error ? (
                        <ErrorMessage message={error} />
                    ) : data.length === 0 ? (
                        <NoResults />
                    ) : (
                        <motion.div
                            className="space-y-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            {data.map((item, index) => (
                                <motion.div
                                    key={`${item.id}-${index}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <CardResultSearch
                                        id={item.id.toString()}
                                        gambar={item.gambar}
                                        judul={item.judul}
                                        deskripsi={item.deskripsi}
                                        url={item.url}
                                        updatedAt={new Date(item.updatedAt).toLocaleString()}
                                        email={item.pembuat?.email || "Email tidak tersedia"}
                                        kategori={item.kategori}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {/* Pagination */}
                    {!isLoading && !error && data.length > 0 && (
                        <div className="mt-8 mb-6 flex justify-center">
                            <Pagination
                                currentPage={pageInfo.currentPage}
                                totalPages={pageInfo.totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Footer and other components */}
            <div className="relative z-10">
                <Feedback />
                <ScrollButton />
                <Sidebar role={role} />
                <Footer />
            </div>
        </div>
    );
};

Result.propTypes = {
    message: PropTypes.string
};

export default Result;