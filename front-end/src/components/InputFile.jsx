import PropTypes from "prop-types";

const InputFile = ({label, onChange, placeholder, name, id}) => {
    return (
        <div className="max-w-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor={id}>
                {label}
            </label>
            <input 
                type="file" 
                placeholder={placeholder}
                name={name}
                id={id} 
                className="block w-full border-2 border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none
                    file:bg-gray-50 file:border-0
                    file:me-4
                    file:py-3 file:px-4"
                onChange={onChange} 
                    
            />
        </div>
    );
}

InputFile.propTypes = {
    label: PropTypes.string,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    name: PropTypes.string,
    id: PropTypes.string,
};

export default InputFile;
