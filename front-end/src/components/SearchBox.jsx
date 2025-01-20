import PropTypes from "prop-types";

const SearchBox = ({placeholder, value, onChange}) => {
    return (
        <div className="max-w-md mx-auto">
            <div className="relative">
                {/* Ikon Pencarian */}
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg
                        className="w-5 h-5 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                </div>

                {/* Input Pencarian */}
                <input
                    type="text"
                    name="search"
                    className="block w-full py-2 pl-10 pr-4 text-sm border rounded-lg focus:ring-blue-500 focus:border-blue-500 border-gray-100 dark:bg-white dark:border-gray-700 dark:text-black-300 dark:placeholder-black-500"
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                />
            </div>
        </div>
    );
};

SearchBox.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
};

export default SearchBox;
