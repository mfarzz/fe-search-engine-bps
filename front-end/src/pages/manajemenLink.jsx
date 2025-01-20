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
    });

    const fetchLinks = useCallback(async () => {
        setIsLoading(true);
        setErrorMessage(null);
        try {
            const response = await listLink({
                page: pageInfo.currentPage,
                limit: pageInfo.limit,
                search
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
    }, [pageInfo.currentPage, pageInfo.limit, search]);

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
            // Append selectedUsers jika visibility private
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



    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex flex-grow bg-white-100 mt-20">
                <div className="flex-grow min-w-[1400px] bg-white mt-1 p-4 mb-[6.2rem] rounded-lg">
                    <div className="w-[1200px] mx-auto">
                        <div className="bg-white shadow rounded-lg">
                            <div className="p-4">
                                {/* Header section */}
                                <div className="mb-8 flex justify-between items-center">
                                    <div className="teFxt-xl font-semibold text-gray-700">
                                        List Link
                                    </div>
                                    <div className="w-72">
                                        <SearchBox
                                            value={search}
                                            onChange={handleSearch}
                                        />
                                    </div>
                                    <ButtonGreen
                                        onClick={togglePopup}
                                        variant="green"
                                        label="Tambah Link"
                                        name="tambah-link"
                                        disabled={isLoading}
                                    >
                                        <Plus className="font-medium" size={15} />
                                    </ButtonGreen>
                                </div>

                                {/* Error Message */}
                                {errorMessage && (
                                    <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
                                        {errorMessage}
                                    </div>
                                )}

                                {/* Loading State */}
                                {isLoading ? (
                                    <div className="flex justify-center items-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                                    </div>
                                ) : (
                                    <div className="overflow-hidden">
                                        <table className="w-full table-fixed border-collapse">
                                            <thead>
                                                <tr className="bg-blue-premier">
                                                    <th className="w-36 px-6 py-3 text-center text-xs font-medium text-white uppercase">
                                                        Judul
                                                    </th>
                                                    <th className="w-64 px-6 py-3 text-center text-xs font-medium text-white uppercase">
                                                        URL
                                                    </th>
                                                    <th className="w-72 px-6 py-3 text-center text-xs font-medium text-white uppercase">
                                                        Deskripsi
                                                    </th>
                                                    <th className="w-32 px-6 py-3 text-center text-xs font-medium text-white uppercase">
                                                        Visibilitas
                                                    </th>
                                                    <th className="w-32 px-6 py-3 text-center text-xs font-medium text-white uppercase">
                                                        File
                                                    </th>
                                                    <th className="w-32 px-6 py-3 text-center text-xs font-medium text-white uppercase">
                                                        Aksi
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {links.map((website, index) => (
                                                    <tr key={index} className="hover:bg-gray-100">
                                                        <td className="w-48 px-6 py-4 text-center text-gray-800">
                                                            <div className="truncate">
                                                                <HighlightText text={website.judul} highlight={search} />
                                                            </div>
                                                        </td>
                                                        <td className="w-64 px-6 py-4 text-center text-gray-800">
                                                            <div className="truncate">
                                                                <a
                                                                    href={website.url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-blue-500 underline hover:text-blue-700"
                                                                >
                                                                    {website.url}
                                                                </a>
                                                            </div>
                                                        </td>
                                                        <td className="w-64 px-6 py-4 text-gray-800">
                                                            <div className="w-full">
                                                                <ExpandableText text={website.deskripsi} maxLength={50} />
                                                            </div>
                                                        </td>
                                                        <td className="w-32 px-6 py-4 text-center text-gray-800">
                                                            {website.visibilitas}
                                                        </td>
                                                        <td className="w-32 px-6 py-4">
                                                            <div className="flex justify-center items-center">
                                                                {website.gambar ? (
                                                                    <div className="w-16 h-16 overflow-hidden flex-shrink-0">
                                                                        <img
                                                                            src={`${API_URL}${website.gambar}`}
                                                                            alt={website.judul}
                                                                            className="w-16 h-16 object-cover"
                                                                        />
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-gray-500">
                                                                        Tidak ada gambar
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="w-32 px-6 py-4">
                                                            <div className="flex justify-center items-center gap-4">
                                                                <button
                                                                    type="button"
                                                                    name="hapus-link"
                                                                    onClick={() => handleDelete(website.id, website.url)}
                                                                    className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800"
                                                                >
                                                                    <Trash2
                                                                        size={20}
                                                                        color="red"
                                                                        className="rounded transition-transform duration-300 transform hover:-translate-y-1"
                                                                    />
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    name="edit-link"
                                                                    onClick={() => handleEdit(website)}
                                                                    className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800"
                                                                >
                                                                    <Pencil
                                                                        size={20}
                                                                        color="orange"
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
                                )}
                            </div>
                        </div>
                        {!isLoading && (
                            <div className="sticky bottom-0 bg-white mt-4 pb-4">
                                <div className="flex justify-end">
                                    <div className="w-auto">
                                        <Pagination
                                            currentPage={pageInfo.currentPage}
                                            totalPages={pageInfo.totalPages}
                                            onPageChange={handlePageChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
                <Sidebar role={role} />
            </div>

            {/* Footer */}
            <div className="fixed bottom-0 w-full min-w-[1400px] bg-white">
                <div className="w-[1200px] mx-auto">
                    <Footer />
                </div>
            </div>

            {/* Popup */}
            {isOpen && (
                <ManajemenLinkPopup
                    isOpen={isOpen}
                    togglePopup={togglePopup}
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
        </div>
    );

};

export default ManajemenLink;
