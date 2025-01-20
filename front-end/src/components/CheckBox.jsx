import PropTypes from "prop-types";

const Checkbox = ({ value, label, checked, onChange, id }) => {
    return (
        <div className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded-md w-full">
            <input 
                type="checkbox" 
                value={value}
                checked={checked}
                onChange={onChange}
                className="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none" 
                id={id}
            />
            <label htmlFor={id} className="text-sm text-gray-500 ms-3 cursor-pointer">
                {label}
            </label>
        </div>
    );
}

Checkbox.propTypes = {
    label: PropTypes.string,
    checked: PropTypes.bool,
    onChange: PropTypes.func,
    id: PropTypes.string,
    value: PropTypes.string,
};

export default Checkbox;