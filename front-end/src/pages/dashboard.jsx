import Footer from "../components/Footer";
import Sidebar from "../components/SideBar";
import Navbar from "../components/Navbar";
import useRole from "../hooks/useRole";

const Dashboard = () => {
  const role = useRole();

  return (
    <div className="flex flex-col min-h-screen">
      <div className="navbar">
        <Navbar label="Selamat Datang" />
      </div>
      <div className="stats mx-8 mt-20 flex-grow">
        <div className="grid grid-cols-2 gap-8 mx-auto">
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
