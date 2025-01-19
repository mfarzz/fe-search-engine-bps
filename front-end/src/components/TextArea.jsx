import PropTypes from "prop-types";

const TextArea = ({ label, value, onChange, placeholder, name, id  }) => {
  return (
    <div className="max-w-sm">
      <label
        htmlFor="textarea-label" className="block text-sm font-medium mb-2"
      >
        {label}
      </label>
      <textarea
        id={id} 
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="py-3 px-4 block w-full border border-gray-300 rounded-lg text-sm focus:border-green focus:ring-green disabled:opacity-50 disabled:pointer-events-none" rows="3" 
        
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
};

export default TextArea;
