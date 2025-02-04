import PropTypes from "prop-types";

const Select = ({ id, label, options, onChange, value, name, required = false }) => {
  const handleChange = (e) => {
    // Pass both name and value to parent's onChange handler
    onChange({
      target: {
        name: name,
        value: e.target.value
      }
    });
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2 text-white" htmlFor={id}>{label}</label>
      <select
        className="py-3 px-4 block w-full border-2 border-gray-200 rounded-lg text-sm focus:border-blue-premier focus:ring-blue-premier disabled:opacity-50 disabled:pointer-events-none"
        onChange={handleChange}
        value={value || ""}
        name={name}
        required={required}
        id={id}
      >
        <option value="" disabled>
          Pilih {label}
        </option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

Select.propTypes = {
  label: PropTypes.string,
  options: PropTypes.array,
  onChange: PropTypes.func,
  value: PropTypes.string,
  name: PropTypes.string,
  required: PropTypes.bool,
  id: PropTypes.string
}

export default Select;