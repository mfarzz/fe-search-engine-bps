import PropTypes from "prop-types";

const TextArea = ({ label, value, onChange, placeholder, name, id, className }) => {
  return (
    <div className="w-full">
      <label
        htmlFor={id} 
        className="block text-sm font-medium mb-2 text-white"
      >
        {label}
      </label>
      <textarea
        id={id} 
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`py-3 px-4 block w-full border-gray-300 rounded-lg text-sm
          bg-white text-gray-900 placeholder-gray-500
          focus:border-green focus:ring-green
          disabled:opacity-50 disabled:pointer-events-none
          ${className}`}
        rows="4"
      ></textarea>
    </div>
  );
};

TextArea.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  name: PropTypes.string,
  id: PropTypes.string,
  className: PropTypes.string,
};

export default TextArea;