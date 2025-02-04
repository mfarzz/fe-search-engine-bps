import PropTypes from "prop-types";

const SelectKategori = ({ 
    label, 
    name, 
    value, 
    onChange, 
    options, 
    required = false,
    className = ""
}) => {
    return (
        <div className={`${className}`}>
            {label && (
                <label className="block text-xs font-medium text-white mb-1 items-center">
                    {label} {required && <span className="text-red-400">*</span>}
                </label>
            )}
            <div className="relative">
                <select
                    name={name}
                    value={value}
                    onChange={onChange}
                    className="w-full pl-4 pr-8 h-10
                           rounded-2xl
                           bg-white/10 
                           border border-white/20
                           text-white
                           backdrop-blur-sm
                           shadow-lg shadow-black/10
                           transition-all duration-200
                           focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400/50
                           hover:bg-white/20
                           appearance-none"
                    required={required}
                >
                    <option value="" className="bg-blue-900 text-white">--Semua--</option>
                    {options.filter(opt => opt !== "").map((option) => (
                        <option 
                            key={option} 
                            value={option}
                            className="bg-blue-900 text-white"
                        >
                            {option}
                        </option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg 
                        className="w-4 h-4 text-white/70" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth="2" 
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </div>
            </div>
        </div>
    );
};

SelectKategori.propTypes = {
    label: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    options: PropTypes.array,
    required: PropTypes.bool,
    className: PropTypes.string
};

export default SelectKategori;