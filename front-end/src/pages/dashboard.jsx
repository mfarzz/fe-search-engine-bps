import Footer from "../components/Footer";
import Sidebar from "../components/SideBar";
import Navbar from "../components/Navbar";
import useRole from "../hooks/useRole";
import StatsWithOverlay from "../components/StatsWithOverlay";
import { UserRound, Link, ChartColumnBig } from "lucide-react";

const Dashboard = () => {
    const role = useRole();

    return (
        <div className="flex flex-col min-h-screen">
            <div className="navbar">
                <Navbar label="Selamat Datang" />
            </div>
            <div className="stats ml-8 mr-8 mt-20 flex-grow">
                <div className="grid grid-cols-3 gap-0">
                    <div className="text-blue-sky ">
                        <StatsWithOverlay
                            label="Pengguna"
                            ikon={UserRound}
                            jumlah="100"
                            keterangan="Orang"
                        />
                    </div>
                    <div className="text-green">
                        <StatsWithOverlay
                            label="URL"
                            ikon={Link}
                            jumlah="50"
                            keterangan="Link"
                        />
                    </div>
                    <div className="text-oren ">
                        <StatsWithOverlay
                            label="Pengunjung"
                            ikon={ChartColumnBig}
                            jumlah="231"
                            keterangan="Pengunjung"
                        />
                    </div>
                </div>
            </div>
            <Sidebar role={role} />
            <div className="w-screen">
                <Footer />
            </div>
        </div>
    );
}

export default Dashboard