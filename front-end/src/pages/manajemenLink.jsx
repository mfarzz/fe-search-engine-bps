import Sidebar from "../components/SideBar";
import Navbar from "../components/Navbar";
import useRole from "../hooks/useRole";
import { useState, useEffect, useCallback } from "react";
import { Trash2, Pencil, Plus, X } from "lucide-react";
import ButtonGreen from "../components/Button";
import SearchBox from "../components/SearchBox";
import Select from "../components/Select";
import Visibility from "../components/Visibility";
import InputFile from "../components/inputFile";
import InputLight from "../components/inputLight";
import Footer from "../components/Footer";
import { API_URL, listLink, tambahLink, hapusLink, editLink } from "../services/manajemenLink.service";
import HighlightText from "../components/HighlightText";
import ExpandableText from "../components/ExpandableText";
import Pagination from "../components/Pagination";
import Swal from "sweetalert2";

const visibilitasOptions = ["Publik", "Private"];

const ManajemenLink = () => {
    const role = useRole();
    const [isOpen, setIsOpen] = useState(false);
    const [isVisibilityPopupVisible, setIsVisibilityPopupVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pageInfo, setPageInfo] = useState({
        currentPage: 1,
        totalPages: 1,
        totalResults: 0,
        limit: 2
    });
    const [search, setSearch] = useState("");
    const [formData, setFormData] = useState({
        id: "",
        judul: "",
        url: "",
        file: null,
        deskripsi: "",
        gambar: "",
        visibilitas: "Publik",
    });

    const fetchLinks = useCallback(async () => {
        setLoading(true);
        setError(null);
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
            setError("Gagal memuat data.");
            throw err;
        } finally {
            setLoading(false);
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
                    Swal.fire("Terhapus!", "Data berhasil dihapus.", "success");
                    setLinks((prevWebsites) =>
                        prevWebsites.filter((item) => item.id !== id)
                    );
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

            // Handle file upload
            if (formData.file instanceof File) {
                form.append("gambar", formData.file); // Ensure the file is appended
            }
            let response;
            if (isEditing) {
                response = await editLink(formData.id, form);
            } else {
                response = await tambahLink(form);
            }

        } catch (error) {

        }
    }

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
            // Validate file type
            const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
            if (!allowedTypes.includes(file.type)) {
                Swal.fire(
                    "Error!",
                    "File harus berupa gambar (JPG, PNG, atau GIF).",
                    "error"
                );
                return;
            }

            const maxSize = 5 * 1024 * 1024;
            if (file.size > maxSize) {
                Swal.fire("Error!", "Ukuran file tidak boleh lebih dari 5MB.", "error");
                return;
            }

            setFormData((prev) => ({
                ...prev,
                file: file,
                gambar: URL.createObjectURL(file),
            }));
        }
    };


    const togglePopup = () => {
        setIsOpen(!isOpen);
        setIsEditing(false);
        setFormData({
            id: "",
            judul: "",
            url: "",
            file: null,
            deskripsi: "",
            gambar: "",
            visibilitas: "Publik",
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
                                        List Link
                                    </div>
                                    <div className="w-72">
                                        <SearchBox
                                            value={search}
                                            onChange={handleSearch}
                                        />
                                    </div>
                                    <ButtonGreen onClick={togglePopup} variant="green" label="Tambah Link" name="tambah-link">
                                        <Plus className="font-medium" size={15} />
                                    </ButtonGreen>
                                </div>

                                {/* Table with fixed layout */}
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


            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity z-40"
                        onClick={togglePopup}
                        aria-hidden="true"
                    />
                    <div className="fixed inset-0 flex justify-center items-center z-50">
                        <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
                            <div className="flex justify-between items-center border-b p-4">
                                <h2 className="text-lg font-semibold text-gray-800">
                                    {isEditing ? "Edit Link" : "Tambah Link"}
                                </h2>
                                <button
                                    onClick={togglePopup}
                                    className="text-gray-500 hover:text-gray-800"
                                >
                                    <X />
                                </button>
                            </div>
                            <div className="pl-4 pt-4 pb-4 pr-4 ml-4 mr-4">
                                <InputLight
                                    label="Judul"
                                    name="judul"
                                    value={formData.judul}
                                    placeholder="Masukkan Nama"
                                    onChange={handleChange}
                                    required
                                />
                                <InputLight
                                    label="URL"
                                    name="url"
                                    value={formData.url}
                                    placeholder="Masukkan URL"
                                    onChange={handleChange}
                                    required
                                />
                                <InputLight
                                    label="Deskripsi"
                                    name="deskripsi"
                                    value={formData.deskripsi}
                                    placeholder="Masukkan Deskripsi"
                                    onChange={handleChange}
                                />
                                <InputFile
                                    label="Gambar"
                                    name="gambar"
                                    value={formData.gambar}
                                    onChange={handleFileChange}
                                    accept="image/*"
                                />
                                <div className="mt-2">
                                    <Select
                                        name="visibilitas"
                                        label="Visibilitas"
                                        options={visibilitasOptions}
                                        value={formData.visibilitas}
                                        onChange={(e) => {
                                            handleChange(e);
                                            if (e.target.value === "Dibatasi") {
                                                setIsVisibilityPopupVisible(true);
                                            } else {
                                                setIsVisibilityPopupVisible(false);
                                            }
                                        }}
                                    />
                                </div>

                                {isVisibilityPopupVisible && (
                                    <Visibility
                                        onClick={() => setIsVisibilityPopupVisible(false)}
                                    />
                                )}

                                <div className="mt-6 flex justify-center space-x-2">
                                    <ButtonGreen onClick={handleSave}>
                                        {isEditing ? "Update" : "Simpan"}
                                    </ButtonGreen>

                                    <ButtonGreen
                                        label={"Batal"}
                                        variant="red"
                                        onClick={togglePopup} >

                                    </ButtonGreen>


                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ManajemenLink;
