import PropTypes from "prop-types";

const StatsWithOverlay = ({ label, jumlah, ikon: Ikon, keterangan }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6 p-6 bg-white-100">
            <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-lg hover:shadow-2xl  transition-all duration-300 ease-in-out transform hover:translate-y-[-10px] hover:z-50">
                <div>
                    <div className="text-lg text-gray-500 mt-3 mb-4">{label}</div>
                    <div className="flex items-center">
                        <div className="text-4xl font-bold text-gray-900 text-shadow-sm">{jumlah}</div>
                        <div className="text-sm ml-5 font-bold">{keterangan}</div>
                    </div>
                </div>
                <div className="bg-gradient-to-r from-blue-400 to-blue-600 shadow rounded-full p-2">
                    {Ikon && <Ikon className="h-10 w-10 text-white" />}
                </div>

            </div>
        </div>
    );
};

StatsWithOverlay.propTypes = {
    label: PropTypes.string,
    jumlah: PropTypes.number,
    ikon: PropTypes.elementType,
    keterangan: PropTypes.string,
};


export default StatsWithOverlay;
