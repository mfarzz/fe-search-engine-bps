import CardResultSearch from "../components/CardResultSearch";
import { cariLink } from "../services/pencarianLink.service";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import { useNavigate } from 'react-router-dom';
import Footer from "../components/Footer";
import Sidebar from "../components/SideBar";
import useRole from "../hooks/useRole";

const Result = () => {
    const role = useRole();
    const [data, setData] = useState([]);
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
                const result = await cariLink(query);
                setData(result.data);
            } catch (err) {
                setError(err.message || "Something went wrong");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [location.search]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
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
            <div className="min-h-screen flex justify-center items-start py-6 md:py-10 px-4 mt-32 md:mt-20">
                <div className="w-full max-w-5xl">
                    {data.length === 0 ? (
                        <div className="text-center text-gray-600">Tidak ada hasil ditemukan.</div>
                    ) : (
                        <div className="grid gap-4">
                            {data.map((item, index) => {
                                // Generate a unique key using both id and index
                                const uniqueKey = `${item.id}-${index}`;
                                return (
                                    <CardResultSearch
                                        key={uniqueKey}
                                        id={item.id.toString()} // Convert ID to string explicitly
                                        gambar={item.gambar}
                                        judul={item.judul}
                                        deskripsi={item.deskripsi}
                                        url={item.url}
                                        updatedAt={new Date(item.updatedAt).toLocaleString()}
                                        email={item.User?.email || "Email tidak tersedia"}
                                    />
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
            <div >
                <Sidebar role={role} />
                <Footer />
            </div>
        </div>
    );
};

export default Result;