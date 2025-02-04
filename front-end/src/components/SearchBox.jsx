import PropTypes from "prop-types";
import { Search } from "lucide-react";

const SearchBox = ({ value, onChange, placeholder = "Cari link...", className = "" }) => {
    return (
        <div className={`relative ${className}`}>
            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full pl-12 pr-4 py-2.5 rounded-2xl h-10
                          backdrop-blur-md bg-white/10 border border-white/20
                          text-white placeholder-white/50
                          focus:border-cyan-300/50 focus:ring-2 focus:ring-cyan-300/20 
                          transition-all duration-200"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50">
                <Search className="w-5 h-5" />
            </div>
        </div>
    );
};

SearchBox.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    className: PropTypes.string
};

export default SearchBox;