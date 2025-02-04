import { useState, useEffect, useCallback } from "react";
import { Trash2, Pencil, Plus, Upload, X } from "lucide-react";
import Swal from "sweetalert2";
import Sidebar from "../components/SideBar";
import Navbar from "../components/Navbar";
import SearchBox from "../components/SearchBox";
import ButtonGreen from "../components/Button";
import SelectKategori from "../components/SelectKategori";
import Select from "../components/Select";
import InputLight from "../components/InputLight";
import Pagination from "../components/Pagination";
import Footer from "../components/Footer";
import HighlightText from "../components/HighlightText";
import useRole from "../hooks/useRole";
import { motion } from 'framer-motion';
import {
    listUser,
    hapusUser,
    tambahUser,
    editUser,
    tambahUserBulk
} from "../services/manajemenUser.service";

const roleOptions = ["admin", "user", "umum"];
const unitOption = ["IPDS", "Sosial", "Distribusi", "Produksi", "Neraca", "Umum"];

const ManajemenUser = () => {
    const role = useRole();
    const [users, setUsers] = useState([]);
    const [pageInfo, setPageInfo] = useState({
        currentPage: 1,
        totalPages: 1,
        totalResults: 0,
        limit: 8
    });
    const [search, setSearch] = useState("");
    const [formData, setFormData] = useState({
        id: "",
        email: "",
        nama: "",
        unit: "",
        role: ""
    });
    const [isOpen, setIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedUnit, setSelectedUnit] = useState("");
    const unitOptions = ["", "IPDS", "Sosial", "Distribusi", "Produksi", "Neraca", "Umum"];

    const fetchUsers = useCallback(async () => {
        try {
            const response = await listUser({
                page: pageInfo.currentPage,
                limit: pageInfo.limit,
                search,
                unit: selectedUnit
            });
            setUsers(response.data);
            setPageInfo(prev => ({
                ...prev,
                ...response.pagination
            }));
        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Gagal memuat data user",
            });
        }
    }, [pageInfo.currentPage, pageInfo.limit, search, selectedUnit]);

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
            currentPage: 1
        }));
    };

    const handleDelete = async (id, nama) => {
        Swal.fire({
            title: `Apakah Anda yakin ingin menghapus ${nama}?`,
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
                    fetchUsers();
                } catch (error) {
                    Swal.fire("Error!", "Gagal menghapus data.", "error");
                }
            }
        });
    };

    const handleEdit = (user) => {
        setIsEditing(true);
        setFormData({
            id: user.id,
            email: user.email,
            nama: user.nama,
            unit: user.unit || "",
            role: user.role
        });
        setIsOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await editUser(formData.id, formData);
                Swal.fire("Berhasil!", "Data user berhasil diperbarui.", "success");
            } else {
                await tambahUser(formData);
                Swal.fire("Berhasil!", "User baru berhasil ditambahkan.", "success");
            }
            setIsOpen(false);
            fetchUsers();
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.response?.data?.message || "Terjadi kesalahan",
            });
        }
    };

    const handleBulkUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const result = await tambahUserBulk(file);
            if (result.summary.gagal > 0) {
                let errorMessage = "Beberapa data gagal ditambahkan:\n\n";
                result.gagal.forEach(item => {
                    errorMessage += `${item.error}\n`;
                });
                Swal.fire({
                    icon: "warning",
                    title: "Import Selesai dengan Warning",
                    text: `Berhasil: ${result.summary.berhasil}, Gagal: ${result.summary.gagal}`,
                    footer: `<pre>${errorMessage}</pre>`
                });
            } else {
                Swal.fire("Berhasil!", "Semua data user berhasil ditambahkan.", "success");
            }
            fetchUsers();
        } catch (error) {
            Swal.fire("Error!", "Gagal mengimport data.", "error");
        }
        e.target.value = '';
    };

    const renderRoleBadge = (role) => {
        const badgeClasses = {
            admin: "bg-red-100 text-red-800",
            user: "bg-blue-100 text-blue-800",
            umum: "bg-orange-100 text-orange-800"
        };

        return (
            <span className={`px-2 py-1 font-medium rounded-full ${badgeClasses[role] || "bg-gray-100 text-gray-800"}`}>
                {role}
            </span>
        );
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { duration: 0.5 }
        }
    };

    const tableVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, delay: 0.2 }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900">
            <Navbar />
            <div className="flex flex-1 pt-20">
                <motion.div
                    className="flex-1 p-6 mx-auto max-w-7xl"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="backdrop-blur-xl bg-white/10 rounded-xl shadow-xl border border-white/20 p-6">
                        <div className="flex flex-col space-y-6">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                                <h2 className="text-2xl font-bold text-white">List User</h2>
                                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                                    <SelectKategori
                                        name="filterUnit"
                                        value={selectedUnit}
                                        onChange={(e) => {
                                            setSelectedUnit(e.target.value);
                                            setPageInfo(prev => ({
                                                ...prev,
                                                currentPage: 1
                                            }));
                                        }}
                                        options={unitOptions}
                                        placeholder="Semua Unit"
                                        className="w-full sm:w-48"
                                    />
                                    <SearchBox
                                        placeholder="Cari nama atau email"
                                        value={search}
                                        onChange={handleSearch}
                                        className="w-full sm:w-72"
                                    />
                                    <div className="flex space-x-2">
                                        <ButtonGreen
                                            onClick={() => {
                                                setIsEditing(false);
                                                setFormData({
                                                    id: "",
                                                    email: "",
                                                    nama: "",
                                                    unit: "",
                                                    role: ""
                                                });
                                                setIsOpen(true);
                                            }}
                                            variant="green"
                                            className="rounded-[1.1rem]"
                                        >
                                            <Plus size={20} />
                                        </ButtonGreen>
                                        <input
                                            type="file"
                                            id="bulkUpload"
                                            className="hidden"
                                            accept=".xlsx,.xls"
                                            onChange={handleBulkUpload}
                                        />
                                        <ButtonGreen
                                            onClick={() => document.getElementById('bulkUpload').click()}
                                            variant="cyan"
                                        >
                                            <Upload className="mr-2" size={20} />
                                            Import Excel
                                        </ButtonGreen>
                                    </div>
                                </div>
                            </div>

                            <motion.div
                                className="overflow-x-auto"
                                variants={tableVariants}
                            >
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-blue-600/30 backdrop-blur-sm">
                                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                                Nama
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                                Email
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                                Role
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                                Unit
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/10">
                                        {users.map((user, index) => (
                                            <tr key={index} className="hover:bg-white/5">
                                                <td className="px-6 py-3 whitespace-nowrap text-white">
                                                    <HighlightText text={user.nama} highlight={search} />
                                                </td>
                                                <td className="px-6 py-3 whitespace-nowrap text-white">
                                                    <HighlightText text={user.email} highlight={search} />
                                                </td>
                                                <td className="px-6 py-3 whitespace-nowrap">
                                                    {renderRoleBadge(user.role)}
                                                </td>
                                                <td className="px-6 py-3 whitespace-nowrap text-white">
                                                    {user.unit || "-"}
                                                </td>
                                                <td className="px-6 py-3 whitespace-nowrap text-center">
                                                    <div className="flex justify-center space-x-2">
                                                        <button
                                                            onClick={() => handleDelete(user.id, user.nama)}
                                                            className="p-2 hover:bg-red-500/20 rounded-full transition-colors"
                                                        >
                                                            <Trash2 size={20} className="text-red-400" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleEdit(user)}
                                                            className="p-2 hover:bg-orange-500/20 rounded-full transition-colors"
                                                        >
                                                            <Pencil size={20} className="text-orange-400" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </motion.div>
                            <div className="mt-4 flex justify-end">
                                <Pagination
                                    currentPage={pageInfo.currentPage}
                                    totalPages={pageInfo.totalPages}
                                    onPageChange={handlePageChange}
                                    className="text-white"
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>
                <Sidebar role={role} />
            </div>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <motion.div
                        className="bg-gradient-to-br from-blue-900 to-purple-900 rounded-lg p-8 w-full max-w-md mx-4"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                    >
                        <div className="flex justify-between items-center border-b border-white/20 pb-4 mb-6">
                            <h2 className="text-xl font-semibold text-white">
                                {isEditing ? "Edit User" : "Tambah User"}
                            </h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-white/60 hover:text-white"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <InputLight
                                    label="Email"
                                    name="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Masukkan email"
                                    required
                                    className="bg-white/10 border-white/20 text-white placeholder-white/50"
                                />

                                <InputLight
                                    label="Nama"
                                    name="nama"
                                    id="nama"
                                    value={formData.nama}
                                    onChange={handleInputChange}
                                    placeholder="Masukkan nama"
                                    required
                                    className="bg-white/10 border-white/20 text-white placeholder-white/50"
                                />

                                <Select
                                    label="Unit"
                                    name="unit"
                                    id="unit"
                                    options={unitOption}
                                    value={formData.unit}
                                    onChange={handleInputChange}
                                    required
                                    className="bg-white/10 border-white/20 text-white"
                                />

                                <Select
                                    label="Role"
                                    name="role"
                                    id="role"
                                    options={roleOptions}
                                    value={formData.role}
                                    onChange={handleInputChange}
                                    required
                                    className="bg-white/10 border-white/20 text-white"
                                />
                            </div>

                            <div className="flex justify-end space-x-4 mt-8">
                                <ButtonGreen
                                    type="submit"
                                    variant="cyan"
                                >
                                    {isEditing ? "Update" : "Simpan"}
                                </ButtonGreen>
                                <ButtonGreen
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    variant="red"
                                >
                                    Batal
                                </ButtonGreen>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
            <div className="absolute bottom-0 w-full">
                <Footer className="text-white mt-8" />
            </div>
        </div>
    );
};

export default ManajemenUser;
