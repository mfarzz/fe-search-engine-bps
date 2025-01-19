import SearchBar from "../components/SearchBar";
import Logo from "../components/Logo";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Sidebar from "../components/SideBar";
import useRole from "../hooks/useRole";
import Footer from "../components/Footer";
import AppIconGrid from "../components/AppIconGrid";
import { seringDikunjungi, terakhirDikunjungi } from "../services/riwayatLink.service";
import ExploreButton from "../components/Explore";

const Home = () => {
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    const videoBackground = "src/assets/tes.mp4";
    const role = useRole();
    const [mostVisited, setMostVisited] = useState([]);
    const [lastVisited, setLastVisited] = useState([]);

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

    const getMostVisited = async () => {
        try {
            const result = await seringDikunjungi();
            setMostVisited(result.data);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    const getTerakhirDikunjungi = async () => {
        try {
            const result = await terakhirDikunjungi();
            setLastVisited(result.data);
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }

    useEffect(() => {
        getMostVisited();
        getTerakhirDikunjungi();
    }, []);

    return (
        <div className="relative h-screen overflow-hidden">
            <video
                autoPlay
                loop
                muted
                className="absolute top-0 left-0 w-full h-full object-cover"
            >
                <source src={videoBackground} type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {/* Content */}
            <div className="relative z-10 items-center justify-center h-full mt-10 pr-4 pl-4 min-w-max">
                <Logo />
                <SearchBar search={search} setSearch={setSearch} onSearch={handleSearch} />

                {/* Container for both sections stacked vertically */}
                <div className="flex flex-col items-center mt-8 space-y-8">
                    {/* Most Visited Section */}
                    {mostVisited.length > 0 && (
                        <div className="flex flex-col items-center">
                            <h1 className="text-white text-lg mb-4">Sering Dikunjungi</h1>
                            <div className="flex space-x-4">
                                {mostVisited.map((item, index) => (
                                    <AppIconGrid
                                        key={index}
                                        id={item.id_link}
                                        judul={item.Link.judul}
                                        gambar={item.Link.gambar}
                                        url={item.Link.url}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Last Visited Section */}
                    {lastVisited.length > 0 && (
                        <div className="flex flex-col items-center">
                            <h1 className="text-white text-lg mb-4">Terakhir Dikunjungi</h1>
                            <div className="flex space-x-4">
                                {lastVisited.map((item, index) => (
                                    <AppIconGrid
                                        key={index}
                                        id={item.id_link}
                                        judul={item.Link.judul}
                                        gambar={item.Link.gambar}
                                        url={item.Link.url}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
                <ExploreButton />
            <div className="absolute bottom-0 w-full">
                <Footer className="text-white" />
            </div>
            <Sidebar role={role} />
        </div>
    );
};

export default Home;