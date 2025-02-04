import { useState, useEffect, useCallback } from "react";
import { Trash2, Pencil, Plus } from "lucide-react";
import Swal from "sweetalert2";
import Sidebar from "../components/SideBar";
import Navbar from "../components/Navbar";
import ButtonGreen from "../components/Button";
import SearchBox from "../components/SearchBox";
import Footer from "../components/Footer";
import { API_URL, listLink, tambahLink, hapusLink, editLink, allUser } from "../services/manajemenLink.service";
import HighlightText from "../components/HighlightText";
import ExpandableText from "../components/ExpandableText";
import Pagination from "../components/Pagination";
import ManajemenLinkPopup from "../components/ManajemenLinkPopup";
import useRole from "../hooks/useRole";
import { klikLink } from '../services/pencarianLink.service';
import SelectKategori from "../components/SelectKategori";
import { motion } from 'framer-motion';


const ManajemenLink = () => {
    const role = useRole();
    const [isOpen, setIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [links, setLinks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [pageInfo, setPageInfo] = useState({
        currentPage: 1,
        totalPages: 1,
        totalResults: 0,
        limit: 5
    });
    const [search, setSearch] = useState("");
    const [formData, setFormData] = useState({
        id: "",
        judul: "",
        url: "",
        deskripsi: "",
        file: null,
        gambar: "",
        visibilitas: "public",
        kategori: "",
    });
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
    const [selectedKategori, setSelectedKategori] = useState(""); // Tambah state untuk kategori
    const kategoriOptions = ["", "IPDS", "Sosial", "Distribusi", "Produksi", "Neraca", "Umum"];

    const fetchLinks = useCallback(async () => {
        setIsLoading(true);
        setErrorMessage(null);
        try {
            const response = await listLink({
                page: pageInfo.currentPage,
                limit: pageInfo.limit,
                search,
                kategori: selectedKategori
            });
            setLinks(response.data);
            setPageInfo(prev => ({
                ...prev,
                ...response.pagination
            }));
        } catch (err) {
            setErrorMessage("Gagal memuat data. Silakan coba lagi nanti.");
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Gagal memuat data. Silakan coba lagi nanti.",
            });
        } finally {
            setIsLoading(false);
        }
    }, [pageInfo.currentPage, pageInfo.limit, search, selectedKategori]);

    useEffect(() => {
        fetchLinks();
    }, [fetchLinks]);

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
                    await hapusLink(id);
                    Swal.fire("Terhapus!", "Data berhasil dihapus.", "success")
                        .then(() => {
                            window.location.reload();
                        });
                } catch (error) {
                    Swal.fire("Error!", "Gagal menghapus data.", "error");
                }
            }
        });
    };

    const handleSave = async () => {
        try {
            if (!formData.judul || !formData.url) {
                Swal.fire("Error!", "Judul dan URL harus diisi.", "error");
                return;
            }

            const form = new FormData();
            form.append("judul", formData.judul);
            form.append("url", formData.url);
            form.append("deskripsi", formData.deskripsi || "");
            form.append("visibilitas", formData.visibilitas);
            form.append("kategori", formData.kategori);
            form.append("sharedWith[]", "");

            if (formData.file instanceof File) {
                // Pastikan field name sesuai dengan yang diexpect multer
                form.append("gambar", formData.file, formData.file.name);  // Tambahkan nama file
            }

            const response = isEditing
                ? await editLink(formData.id, form)
                : await tambahLink(form);

            if (response) {
                Swal.fire({
                    icon: "success",
                    title: isEditing ? "Link berhasil diperbarui!" : "Link berhasil ditambahkan!",
                    showConfirmButton: false,
                    timer: 1500
                });
                togglePopup();
                fetchLinks();
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Terjadi kesalahan saat menyimpan data!"
            });
        }
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                file: file,
                gambar: URL.createObjectURL(file)
            }));
        }
    };


    const togglePopup = () => {
        setIsOpen(!isOpen);
        setIsEditing(false);
        setSelectedUsers([]); // Reset selected users
        setFormData({
            id: "",
            judul: "",
            url: "",
            deskripsi: "",
            file: null,
            gambar: "",
            visibilitas: "public",
        });
    };

    const handleEdit = (website) => {
        setIsEditing(true);

        // Set selected users dari data sharedWith
        if (website.visibilitas.toLowerCase() === 'private' && website.sharedWith) {
            // Kita perlu mendapatkan ID user yang terkait melalui all-user endpoint
            const userEmails = website.sharedWith.map(share => share.user.email);

            // Gunakan allUser untuk mendapatkan ID berdasarkan email
            allUser({ search: '' }).then(response => {
                const users = response.data;
                const selectedUserIds = users
                    .filter(user => userEmails.includes(user.email))
                    .map(user => user.id);
                setSelectedUsers(selectedUserIds);
            });
        } else {
            setSelectedUsers([]);
        }

        setFormData({
            id: website.id,
            judul: website.judul,
            url: website.url,
            deskripsi: website.deskripsi || "",
            file: null,
            gambar: website.gambar ? `${API_URL}${website.gambar}` : "",
            visibilitas: website.visibilitas.toLowerCase(),
            kategori: website.kategori,
        });
        setIsOpen(true);
    };

    const handleSaveWithUsers = async (selectedUsers) => {
        try {
            if (!formData.judul || !formData.url) {
                Swal.fire("Error!", "Judul dan URL harus diisi.", "error");
                return;
            }

            const form = new FormData();
            form.append("judul", formData.judul);
            form.append("url", formData.url);
            form.append("deskripsi", formData.deskripsi || "");
            form.append("visibilitas", formData.visibilitas);
            form.append("kategori", formData.kategori);
            selectedUsers.forEach(userId => {
                form.append("sharedWith[]", userId);
            })

            if (formData.file instanceof File) {
                form.append("gambar", formData.file, formData.file.name);
            }

            const response = isEditing
                ? await editLink(formData.id, form)
                : await tambahLink(form);

            if (response) {
                Swal.fire({
                    icon: "success",
                    title: isEditing ? "Link berhasil diperbarui!" : "Link berhasil ditambahkan!",
                    showConfirmButton: false,
                    timer: 1500
                });
                togglePopup();
                fetchLinks();
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Terjadi kesalahan saat menyimpan data!"
            });
        }
    };

    const handleClick = async (id, url) => {
        try {
            await klikLink(id);
            window.open(url, '_blank', 'noopener,noreferrer');
        } catch (error) {
            console.error('Error recording link click:', error);
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    }

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
                                <h2 className="text-2xl font-bold text-white">List Link</h2>
                                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                                    <SelectKategori
                                        name="filterKategori"
                                        value={selectedKategori}
                                        onChange={(e) => {
                                            setSelectedKategori(e.target.value);
                                            setPageInfo(prev => ({
                                                ...prev,
                                                currentPage: 1
                                            }));
                                        }}
                                        options={kategoriOptions}
                                        placeholder="Semua Kategori"
                                        className="w-full sm:w-48"
                                    />
                                    <SearchBox
                                        value={search}
                                        onChange={(e) => {
                                            setSearch(e.target.value);
                                            setPageInfo(prev => ({
                                                ...prev,
                                                currentPage: 1
                                            }));
                                        }}
                                        className="w-full sm:w-72"
                                    />
                                    <ButtonGreen
                                        onClick={() => {
                                            setIsEditing(false);
                                            setFormData({
                                                id: "",
                                                judul: "",
                                                url: "",
                                                deskripsi: "",
                                                file: null,
                                                gambar: "",
                                                visibilitas: "public",
                                                kategori: "",
                                            });
                                            setIsOpen(true);
                                        }}
                                        variant="green"
                                        className="rounded-[1.1rem]"
                                    >
                                        <Plus size={20} />
                                    </ButtonGreen>
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
                                                Judul
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                                URL
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                                Kategori
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                                Deskripsi
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                                Visibilitas
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                                                File
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/10">
                                        {links.map((link, index) => (
                                            <tr key={index} className="hover:bg-white/5">
                                                <td className="px-6 py-3 whitespace-nowrap text-white">
                                                    <HighlightText text={link.judul} highlight={search} />
                                                </td>
                                                <td className="px-6 py-3 whitespace-nowrap text-white">
                                                    <a
                                                        href="#"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleClick(link.id, link.url);
                                                        }}
                                                        className="text-blue-300 hover:text-blue-200 underline"
                                                    >
                                                        <HighlightText text={link.url} highlight={search} />
                                                    </a>
                                                </td>
                                                <td className="px-6 py-3 whitespace-nowrap text-white">
                                                    {link.kategori || "-"}
                                                </td>
                                                <td className="px-6 py-3 text-white">
                                                    <ExpandableText text={link.deskripsi} maxLength={50} />
                                                </td>
                                                <td className="px-6 py-3 whitespace-nowrap">
                                                    <span className={`px-2 py-1 text-sm font-medium rounded-full ${
                                                        link.visibilitas === 'public' 
                                                            ? 'bg-emerald-400 text-emerald-800'
                                                            : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                        {link.visibilitas}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-3">
                                                    <div className="flex justify-center">
                                                        {link.gambar ? (
                                                            <div className="w-12 h-12 rounded-lg overflow-hidden">
                                                                <img
                                                                    src={`${API_URL}${link.gambar}`}
                                                                    alt={link.judul}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                        ) : (
                                                            <span className="text-white/60">-</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-3 whitespace-nowrap text-center">
                                                    <div className="flex justify-center space-x-2">
                                                        <button
                                                            onClick={() => handleDelete(link.id, link.judul)}
                                                            className="p-2 hover:bg-red-500/20 rounded-full transition-colors"
                                                        >
                                                            <Trash2 size={20} className="text-red-400" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleEdit(link)}
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

            {isOpen && (
                <ManajemenLinkPopup
                    isOpen={isOpen}
                    togglePopup={() => setIsOpen(false)}
                    isEditing={isEditing}
                    formData={formData}
                    handleChange={handleChange}
                    handleFileChange={handleFileChange}
                    handleSave={handleSave}
                    onSaveWithUsers={handleSaveWithUsers}
                    initialSelectedUsers={selectedUsers}
                    isLoading={isLoading}
                />
            )}
            
            <div className="absolute bottom-0 w-full">
                <Footer className="text-white mt-8" />
            </div>
        </div>
    );

};

export default ManajemenLink;
