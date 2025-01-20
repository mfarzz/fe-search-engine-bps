import { useState, useEffect } from "react";
import { X } from "lucide-react";
import ButtonGreen from "./Button";
import SearchBox from "./SearchBox";
import Select from "./Select";
import Checkbox from "./CheckBox";
import InputLight from "./InputLight";
import InputFile from "./InputFile";
import { allUser } from "../services/manajemenLink.service";
import PropTypes from "prop-types";
import imageCompression from "browser-image-compression";
import Swal from "sweetalert2";

const visibilitasOptions = ["public", "private"];

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

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await allUser({ search });
                const fetchedUsers = response.data;
                setUsers(fetchedUsers);
            } catch (error) {
                console.error(error);
            }
        };

        fetchUsers();
    }, [search]);

    useEffect(() => {
        // Reset selectedUsers ketika popup dibuka/ditutup
        setSelectedUsers(initialSelectedUsers);
    }, [isOpen, initialSelectedUsers]);

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    const handleCheckboxChange = (userId) => {
        setSelectedUsers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
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
        console.log(file);
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
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity z-40"
                onClick={togglePopup}
                aria-hidden="true"
            />
            <div className="fixed inset-0 flex justify-center items-center z-50">
                <div className="bg-white rounded-lg shadow-lg w-[900px] mx-4">
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

                    <div className="grid grid-cols-2 gap-6 p-6">
                        {/* Left Column - Basic Information */}
                        <div className="space-y-4">
                            <h3 className="text-md font-semibold mb-4">Informasi Link</h3>
                            <InputLight
                                label="Judul"
                                name="judul"
                                id="judul"
                                value={formData.judul}
                                placeholder="Masukkan Nama"
                                onChange={handleChange}
                                required
                            />
                            <InputLight
                                label="URL"
                                name="url"
                                id="url"
                                value={formData.url}
                                placeholder="Masukkan URL"
                                onChange={handleChange}
                                required
                            />
                            <InputLight
                                label="Deskripsi"
                                name="deskripsi"
                                id="deskripsi"
                                value={formData.deskripsi}
                                placeholder="Masukkan Deskripsi"
                                onChange={handleChange}
                            />
                            <div className="space-y-2">
                                <InputFile
                                    label="Gambar"
                                    name="gambar"
                                    id="gambar"
                                    onChange={handleLocalFileChange}
                                    accept="image/*"
                                    disabled={isCompressing}
                                />
                                {isCompressing && (
                                    <div className="text-sm text-blue-600 time-300">
                                        Sedang memproses gambar...
                                    </div>
                                )}
                            </div>
                            {formData.gambar && (
                                <div className="mt-2">
                                    <p className="text-sm text-gray-600 mb-2">
                                        Preview Gambar:
                                    </p>
                                    <img
                                        src={formData.gambar}
                                        alt="Preview"
                                        className="w-20 h-20 object-cover rounded"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Right Column - Visibility and User Selection */}
                        <div className="space-y-4">
                            <h3 className="text-md font-semibold mb-4">Pengaturan Akses</h3>
                            <Select
                                name="visibilitas"
                                label="Visibilitas"
                                id="visibilitas"
                                options={visibilitasOptions}
                                value={formData.visibilitas}
                                onChange={handleChange}
                            />

                            {formData.visibilitas === "private" && (
                                <div className="mt-4 space-y-4">
                                    <div className="border rounded-lg p-4">
                                        <h4 className="text-sm font-medium mb-2">Pilih Pengguna</h4>
                                        <SearchBox
                                            placeholder="Cari pengguna..."
                                            value={search}
                                            onChange={handleSearch}
                                        />
                                        <div className="mt-4 max-h-36 overflow-y-auto space-y-2">
                                            {users.map((user) => (
                                                <Checkbox
                                                    key={user.id}
                                                    value={user.id}
                                                    id={user.id}
                                                    label={user.nama}
                                                    checked={selectedUsers.includes(user.id)}
                                                    onChange={() => handleCheckboxChange(user.id)}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="border-t p-4 flex justify-end space-x-2">
                        <ButtonGreen onClick={() => {
                            // Kirim selectedUsers saat visibilitas private
                            if (formData.visibilitas === "private") {
                                onSaveWithUsers(selectedUsers);
                            } else {
                                handleSave();
                            }
                        }}>
                            {isEditing ? "Update" : "Simpan"}
                        </ButtonGreen>
                        <ButtonGreen
                            label="Batal"
                            variant="red"
                            onClick={togglePopup}
                        />
                    </div>
                </div>
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