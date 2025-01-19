import Sidebar from "../components/SideBar";
import Navbar from "../components/Navbar";
import useRole from "../hooks/useRole";
import { useState, useEffect, useCallback } from "react";
import { Trash2 } from "lucide-react";
import SearchBox from "../components/SearchBox";
import Pagination from "../components/Pagination";
import Footer from "../components/Footer";
import HighlightText from "../components/HighlightText";
import { listUser, hapusUser } from "../services/manajemenUser.service";
import Swal from "sweetalert2";

const ManajemenUser = () => {
    const role = useRole();
    const [users, setUsers] = useState([]);
    const [pageInfo, setPageInfo] = useState({
        currentPage: 1,
        totalPages: 1,
        totalResults: 0,
        limit: 10
    });
    const [search, setSearch] = useState("");

    const fetchUsers = useCallback(async () => {
        try {
            const response = await listUser({
                page: pageInfo.currentPage,
                limit: pageInfo.limit,
                search
            });
            setUsers(response.data);
            setPageInfo(prev => ({
                ...prev,
                ...response.pagination
            }));
        } catch (err) {
            console.error(err);
            throw err;
        }
    }, [pageInfo.currentPage, pageInfo.limit, search]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handlePageChange = (newPage) => {
        setPageInfo(prev => ({
            ...prev,
            currentPage: newPage
        }));
    };

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setPageInfo(prev => ({
            ...prev,
            currentPage: 1 // Reset to first page when searching
        }));
    };

    const handleDelete = async (id, data) => {
        Swal.fire({
            title: `Apakah Anda yakin ingin menghapus ${data}?`,
            text: "Data yang dihapus tidak dapat dikembalikan!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Hapus!',
            reverseButtons: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await hapusUser(id);
                    Swal.fire("Terhapus!", "Data berhasil dihapus.", "success");
                    setUsers((prevUsers) =>
                        prevUsers.filter((item) => item.id !== id)
                    );
                } catch (error) {
                    Swal.fire("Error!", "Gagal menghapus data.", "error");
                    throw error;
                }
            }
        });
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex flex-grow bg-white-100 mt-20">
                {/* Main content container with min-width to prevent shrinking */}
                <div className="flex-grow min-w-[1400px] bg-white mt-1 p-4 mb-3 rounded-lg">
                    {/* Fixed width content wrapper */}
                    <div className="w-[1200px] mx-auto">
                        {/* Table container with shadow and fixed width */}
                        <div className="bg-white shadow rounded-lg">
                            <div className="p-4">
                                {/* Header section */}
                                <div className="mb-8 flex justify-between items-center">
                                    <div className="text-xl font-semibold text-gray-700">
                                        List User
                                    </div>
                                    <div className="w-72">
                                        <SearchBox
                                            placeholder="Cari User"
                                            value={search}
                                            onChange={handleSearch}
                                        />
                                    </div>
                                </div>
                                <div className="overflow-hidden">
                                    <table className="w-full table-fixed border-collapse">
                                        <thead>
                                            <tr className="bg-blue-premier">
                                                <th className="w-36 px-6 py-3 text-center text-xs font-medium text-white uppercase">
                                                    Nama
                                                </th>
                                                <th className="w-40 px-6 py-3 text-center text-xs font-medium text-white uppercase">
                                                    Email
                                                </th>
                                                <th className="w-32 px-6 py-3 text-center text-xs font-medium text-white uppercase">
                                                    Aksi
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {users.map((user, index) => (
                                                <tr key={index} className="hover:bg-gray-100">
                                                    <td className="w-36 px-6 py-4 text-center text-gray-800">
                                                        <div className="truncate">
                                                            <HighlightText text={user.nama} highlight={search} />
                                                        </div>
                                                    </td>
                                                    <td className="w-40 px-6 py-4 text-center text-gray-800">
                                                        {user.email}
                                                    </td>
                                                    <td className="w-32 px-6 py-4">
                                                        <div className="flex justify-center items-center gap-4">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleDelete(user.id, user.nama)}
                                                                className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800"

                                                            >
                                                                <Trash2
                                                                    size={20}
                                                                    color="red"
                                                                    className="rounded transition-transform duration-300 transform hover:-translate-y-1"
                                                                />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        {/* Pagination with fixed position */}
                        <div className="mt-4 flex justify-end">
                            <div className="w-auto">
                                <Pagination
                                    currentPage={pageInfo.currentPage}
                                    totalPages={pageInfo.totalPages}
                                    onPageChange={handlePageChange}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <Sidebar role={role} />
            </div>
            <div className="fixed bottom-0 w-full min-w-[1400px] bg-white">
                <div className="w-[1200px] mx-auto">
                    <Footer />
                </div>
            </div>
        </div>
    );
};

export default ManajemenUser;
