import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Checkbox from "./CheckBox";
import SearchBox from "./SearchBox";
import ButtonGreen from "./Button";
import PropTypes from "prop-types";

function Visibility({ onClick }) {
    const navigate = useNavigate(); // Inisialisasi useNavigate

    // Dummy data pengguna
    const users = Array.from({ length: 20 }, (_, index) => ({
        id: index + 1,
        name: `Pengguna ${index + 1}`,
    }));

    // State untuk menyimpan pengguna yang dipilih
    const [selectedUsers, setSelectedUsers] = useState([]);

    // Fungsi untuk menangani checkbox
    const handleUserSelection = (userId) => {
        setSelectedUsers((prevSelected) =>
            prevSelected.includes(userId)
                ? prevSelected.filter((id) => id !== userId)
                : [...prevSelected, userId]
        );
    };

    return (
        <>
            {/* Pop-up langsung tampil */}
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white rounded-lg shadow-lg w-1/3 p-6 relative">
                    {/* Tombol silang untuk menutup pop-up */}
                    <button
                        className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                        onClick={() => navigate(-1)}
                    >
                        &times;
                    </button>

                    <h3 className="text-lg font-semibold mb-4">Pilih Pengguna</h3>
                    <SearchBox />
                    <div
                        className="overflow-y-auto max-h-60 border border-gray-300 rounded p-2"
                        style={{ maxHeight: "300px" }}
                    >
                        {users.map((user) => (
                            <Checkbox
                                key={user.id}
                                label={user.name}
                                checked={selectedUsers.includes(user.id)}
                                onChange={() => handleUserSelection(user.id)}
                            />
                        ))}
                    </div>
                    <div className="mt-4 flex justify-center space-x-2">
                        <ButtonGreen
                            label={"Simpan"}
                            onClick={() => {
                                console.log("Pengguna Terpilih:", selectedUsers);
                                onClick();
                            }}
                        />

                        <div className="">
                            <ButtonGreen
                                label={"Batal"}
                                variant="red"
                                onClick={() => {
                                    console.log("Pengguna Terpilih:", selectedUsers);
                                    onClick();
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Visibility.propTypes = {
    onClick: PropTypes.func,
};


export default Visibility;
