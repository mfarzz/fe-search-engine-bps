import PropTypes from "prop-types";

const Checkbox = ({ label }) => {
    return (
        <>
            <div className="flex">
                <input type="checkbox" className="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none" id="hs-default-checkbox" />
                <label htmlFor="hs-default-checkbox" className="text-sm text-gray-500 ms-3">{label}</label>
            </div>
        </>
    );
}

Checkbox.propTypes = {
    label: PropTypes.string,
};

export default Checkbox;