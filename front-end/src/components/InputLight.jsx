import PropTypes from "prop-types";

const InputLight = ({ label, value, onChange, placeholder, required, isSidebarOpen, name, id }) => {
    return (
        <div className={`max-w-lg relative ${isSidebarOpen ? "z-30" : "z-50"} w-full m-auto`}>
            <label htmlFor={id} className="block text-sm font-medium mb-2 mt-2 text-white">{label}</label>
            <input
                className="py-3 px-4 block w-full border-2 border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                label={label}
                placeholder={placeholder}
                name={name}
                id={id}
                value={value}
                onChange={onChange}
                required={required}
            />
        </div>
    );
};

InputLight.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    required: PropTypes.bool,
    isSidebarOpen: PropTypes.bool,
    name: PropTypes.string,
    id: PropTypes.string,
};

export default InputLight;