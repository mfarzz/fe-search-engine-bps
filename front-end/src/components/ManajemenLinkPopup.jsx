import { useState, useEffect } from "react";
import { X } from "lucide-react";
import ButtonGreen from "./Button";
import SearchBox from "./SearchBox";
import Select from "./Select";
import SelectKategori from "./SelectKategori";
import Checkbox from "./CheckBox";
import InputLight from "./InputLight";
import InputFile from "./InputFile";
import { allUser } from "../services/manajemenLink.service";
import PropTypes from "prop-types";
import imageCompression from "browser-image-compression";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import TextArea from "./TextArea";

const visibilitasOptions = ["public", "private"];
const kategoriOptions = ["IPDS", "Sosial", "Distribusi", "Produksi", "Neraca", "Umum"];

function ManajemenLinkPopup({
    isOpen,
    togglePopup,
    isEditing,
    formData,
    handleChange,
    handleFileChange,
    handleSave,
    onSaveWithUsers,
    initialSelectedUsers = []
}) {
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState(initialSelectedUsers);
    const [isCompressing, setIsCompressing] = useState(false);
    const [unitFilter, setUnitFilter] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await allUser({ search, unit: unitFilter });
                const fetchedUsers = response.data;
                setUsers(fetchedUsers);
            } catch (error) {
                console.error(error);
            }
        };

        fetchUsers();
    }, [search, unitFilter]);

    useEffect(() => {
        // Reset selectedUsers ketika popup dibuka/ditutup
        setSelectedUsers(initialSelectedUsers);
    }, [isOpen, initialSelectedUsers]);

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    const filteredUsers = users.filter(user => {
        const matchesUnit = !unitFilter || user.unit === unitFilter;
        const matchesSearch = !search ||
            user.nama.toLowerCase().includes(search.toLowerCase()) ||
            user.unit.toLowerCase().includes(search.toLowerCase());
        return matchesUnit && matchesSearch;
    });

    const handleCheckboxChange = (userId, userIds = null) => {
        if (userIds !== null) {
            setSelectedUsers(userIds);
            return;
        }

        setSelectedUsers(prev => {
            if (prev.includes(userId)) {
                return prev.filter(id => id !== userId);
            } else {
                return [...prev, userId];
            }
        });
    };

    const handleUnitFilterChange = (e) => {
        setUnitFilter(e.target.value);
    };

    const processImage = async (file) => {
        try {
            const options = {
                maxSizeKB: 200,
                maxWidthOrHeight: 800,
                useWebWorker: true,
                fileType: file.type,
            };

            setIsCompressing(true);
            const compressedFile = await imageCompression(file, options);

            // Buat File baru dari Blob dengan nama asli
            const processedFile = new File(
                [compressedFile],
                file.name,  // Gunakan nama file asli
                {
                    type: compressedFile.type,
                    lastModified: new Date().getTime()
                }
            );

            const reader = new FileReader();

            return new Promise((resolve, reject) => {
                reader.onload = () => {
                    resolve({
                        compressedFile: processedFile, // Kirim File baru, bukan Blob
                        previewUrl: reader.result,
                    });
                };
                reader.onerror = reject;
                reader.readAsDataURL(compressedFile);
            });
        } catch (error) {
            console.error("Error compressing image:", error);
            throw error;
        }
    };

    const handleLocalFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) {
            // Jika tidak ada file, reset preview
            handleChange({
                target: {
                    name: "gambar",
                    value: "",
                },
            });
            return;
        }

        // Validasi tipe file
        const allowedTypes = ["image/jpeg", "image/png"];
        if (!allowedTypes.includes(file.type)) {
            Swal.fire("Error!", "File harus berupa gambar (JPG atau PNG).", "error");
            e.target.value = "";
            handleChange({
                target: {
                    name: "gambar",
                    value: "",
                },
            }); // Reset preview
            return;
        }

        // Validasi ukuran file (5MB max)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            Swal.fire("Error!", "Ukuran file tidak boleh lebih dari 5MB.", "error");
            e.target.value = "";
            handleChange({
                target: {
                    name: "gambar",
                    value: "",
                },
            }); // Reset preview
            return;
        }

        try {
            setIsCompressing(true);
            const { compressedFile, previewUrl } = await processImage(file);
            handleFileChange({
                target: {
                    files: [compressedFile],
                },
            });
            // Update preview in parent component
            handleChange({
                target: {
                    name: "gambar",
                    value: previewUrl,
                },
            });
        } catch (error) {
            console.error("Error processing image:", error);
            Swal.fire("Error!", "Gagal memproses gambar. Silakan coba lagi.", "error");
            e.target.value = "";
            handleChange({
                target: {
                    name: "gambar",
                    value: "",
                },
            }); // Reset preview
        } finally {
            setIsCompressing(false);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div
                className="fixed inset-0 backdrop-blur-sm bg-black/50 transition-opacity z-40"
                onClick={togglePopup}
                aria-hidden="true"
            />
            <div className="fixed inset-0 flex justify-center items-center z-50 p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="backdrop-blur-xl bg-gradient-to-br from-blue-950/80 via-indigo-900/80 to-blue-900/80
                             border border-white/10 rounded-xl shadow-2xl w-full max-w-[900px]
                             text-black max-h-[90vh] flex flex-col"
                >
                    {/* Header - Fixed */}
                    <div className="flex justify-between items-center border-b border-white/10 p-4 shrink-0">
                        <h2 className="text-xl font-semibold text-white/90">
                            {isEditing ? "Edit Link" : "Tambah Link"}
                        </h2>
                        <button
                            onClick={togglePopup}
                            className="text-white/60 hover:text-white/90 transition-colors"
                        >
                            <X />
                        </button>
                    </div>

                    {/* Scrollable Content */}
                    <div className="overflow-y-auto flex-grow">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                            {/* Left Column - Basic Information */}
                            <div className="space-y-4">
                                <h3 className="text-md font-semibold mb-4 text-white/90">Informasi Link</h3>
                                <InputLight
                                    label="Judul"
                                    name="judul"
                                    id="judul"
                                    value={formData.judul}
                                    placeholder="Masukkan Nama"
                                    onChange={handleChange}
                                    required
                                    className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                                />
                                <InputLight
                                    label="URL"
                                    name="url"
                                    id="url"
                                    value={formData.url}
                                    placeholder="Masukkan URL"
                                    onChange={handleChange}
                                    required
                                    className="bg-white border-gray-300 text-gray-900"
                                />
                                <Select
                                    name="kategori"
                                    label="Kategori"
                                    options={kategoriOptions}
                                    value={formData.kategori}
                                    onChange={handleChange}
                                    required
                                    className="bg-white border-gray-300 text-gray-900"
                                />
                                <TextArea
                                    label="Deskripsi"
                                    name="deskripsi"
                                    id="deskripsi"
                                    value={formData.deskripsi}
                                    placeholder="Masukkan Deskripsi"
                                    onChange={handleChange}
                                    className="w-full max-w-none"
                                />
                                <div className="space-y-2">
                                    <InputFile
                                        label="Gambar"
                                        name="gambar"
                                        id="gambar"
                                        onChange={handleLocalFileChange}
                                        accept="image/*"
                                        disabled={isCompressing}
                                        className="bg-white border-gray-300 text-gray-900"
                                    />
                                    {isCompressing && (
                                        <div className="text-sm text-cyan-300">
                                            Sedang memproses gambar...
                                        </div>
                                    )}
                                </div>
                                {formData.gambar && (
                                    <div className="mt-2">
                                        <p className="text-sm text-white/60 mb-2">
                                            Preview Gambar:
                                        </p>
                                        <div className="relative w-20 h-20 rounded-lg overflow-hidden
                                                      ring-2 ring-white/10 group">
                                            <img
                                                src={formData.gambar}
                                                alt="Preview"
                                                className="w-full h-full object-cover 
                                                         transition-transform duration-300 group-hover:scale-110"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Right Column - Visibility and User Selection */}
                            <div className="space-y-4">
                                <h3 className="text-md font-semibold mb-4 text-white/90">Pengaturan Akses</h3>
                                <Select
                                    name="visibilitas"
                                    label="Visibilitas"
                                    id="visibilitas"
                                    options={visibilitasOptions}
                                    value={formData.visibilitas}
                                    onChange={handleChange}
                                    className="bg-white border-gray-300 text-gray-900"
                                />

                                {formData.visibilitas === "private" && (
                                    <div className="mt-4 space-y-4">
                                        <div className="border border-white/10 rounded-lg p-4 bg-white/5">
                                            <h4 className="text-sm font-medium mb-2 text-white">Pilih Pengguna</h4>
                                            <div className="flex items-center space-x-2">
                                                <SearchBox
                                                    placeholder="Cari pengguna..."
                                                    value={search}
                                                    onChange={handleSearch}
                                                    className="w-full sm:w-80"
                                                />
                                                <SelectKategori
                                                    name="filterUnit"
                                                    options={["IPDS", "Sosial", "Distribusi", "Produksi", "Neraca", "Umum"]}
                                                    value={unitFilter}
                                                    onChange={handleUnitFilterChange}
                                                    placeholder="Filter Unit"
                                                    className="w-full sm:w-[12rem]"
                                                />
                                            </div>

                                            <div className="mt-4 space-y-1">
                                                <Checkbox
                                                    id="select-all"
                                                    value="select-all"
                                                    label="(Select Current Section)"
                                                    checked={users.length === selectedUsers.length}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            handleCheckboxChange(null, users.map(user => user.id));
                                                        } else {
                                                            handleCheckboxChange(null, []);
                                                        }
                                                    }}
                                                />
                                            </div>
                                            <div className="mt-1 max-h-56 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                                                {filteredUsers.map((user) => (
                                                    <Checkbox
                                                        key={user.id}
                                                        value={user.id}
                                                        id={user.id}
                                                        label={user.nama}
                                                        rightLabel={user.unit}
                                                        checked={selectedUsers.includes(user.id)}
                                                        onChange={() => handleCheckboxChange(user.id)}
                                                        className="text-white"
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Footer - Fixed */}
                    <div className="border-t border-white/10 p-4 flex justify-end space-x-2 bg-white/5 shrink-0">
                        <ButtonGreen
                            onClick={() => {
                                if (formData.visibilitas === "private") {
                                    onSaveWithUsers(selectedUsers);
                                } else {
                                    handleSave();
                                }
                            }}
                            variant="cyan"
                        >
                            {isEditing ? "Update" : "Simpan"}
                        </ButtonGreen>
                        <ButtonGreen
                            variant="red"
                            onClick={togglePopup}
                        >
                            Batal
                        </ButtonGreen>
                    </div>
                </motion.div>
            </div>
        </>
    );
}

ManajemenLinkPopup.propTypes = {
    formData: PropTypes.object.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleFileChange: PropTypes.func.isRequired,
    handleSave: PropTypes.func.isRequired,
    isEditing: PropTypes.bool,
    isOpen: PropTypes.bool,
    togglePopup: PropTypes.func,
    onSaveWithUsers: PropTypes.func,
    initialSelectedUsers: PropTypes.array,
};

export default ManajemenLinkPopup;