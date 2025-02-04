import PropTypes from "prop-types";

const Checkbox = ({ value, label, checked, onChange, id, rightLabel }) => {
    return (
        <div className="flex items-center justify-between cursor-pointer hover:bg-white/15 p-1 rounded-md w-full">
            <div className="flex items-center flex-1">
                <input 
                    type="checkbox" 
                    value={value}
                    checked={checked}
                    onChange={onChange}
                    className="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none" 
                    id={id}s
                />
                <label htmlFor={id} className="text-sm text-white/80 ms-3 cursor-pointer">
                    {label}
                </label>
            </div>
            {rightLabel && (
                <span className="text-sm text-white/80 mr-2">
                    {rightLabel}
                </span>
            )}
        </div>
    );
}

Checkbox.propTypes = {
    label: PropTypes.string,
    rightLabel: PropTypes.string,
    checked: PropTypes.bool,
    onChange: PropTypes.func,
    id: PropTypes.string,
    value: PropTypes.string,
};

export default Checkbox;