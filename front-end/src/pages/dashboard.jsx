import { useState, useEffect } from "react";
import Footer from "../components/Footer";
import Sidebar from "../components/SideBar";
import Navbar from "../components/Navbar";
import useRole from "../hooks/useRole";
import StatsWithOverlay from "../components/StatsWithOverlay";
import { UserRound, Link } from "lucide-react";

const Dashboard = () => {
  const role = useRole();
  const [linkCount, setLinkCount] = useState(0);
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch link count
        const linkResponse = await fetch("http://localhost:3000/list-link", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const linkData = await linkResponse.json();

        if (linkData.status && linkData.pagination) {
          setLinkCount(linkData.pagination.totalResults);
        }

        // Fetch user count
        const userResponse = await fetch("http://localhost:3000/all-user", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const userData = await userResponse.json();

        if (userData.data) {
          setUserCount(userData.data.length + 1);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="navbar">
        <Navbar label="Selamat Datang" />
      </div>
      <div className="stats mx-8 mt-20 flex-grow">
        <div className="grid grid-cols-2 gap-8 mx-1 mx-auto">
          <div className="hover-card text-blue-sky transform transition-all duration-300">
            <a
              href="http://localhost:5174/user"
              className="no-underline text-current"
            >
              <StatsWithOverlay
                label={<span className="text-3xl font-semibold">Pengguna</span>}
                ikon={UserRound}
                jumlah={<span className="text-4xl font-bold">{userCount}</span>}
                keterangan={<span className="text-2xl">Orang</span>}
              />
            </a>
          </div>
          <div className="hover-card text-green transform transition-all duration-300">
            <a
              href="http://localhost:5174/link"
              className="no-underline text-current"
            >
              <StatsWithOverlay
                label={<span className="text-3xl font-semibold">URL</span>}
                ikon={Link}
                jumlah={<span className="text-4xl font-bold">{linkCount}</span>}
                keterangan={<span className="text-2xl">Link</span>}
              />
            </a>
          </div>
        </div>
      </div>
      <Sidebar role={role} />
      <div className="w-screen">
        <Footer />
      </div>
    </div>
  );
};



export default Dashboard;
