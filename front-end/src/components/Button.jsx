import PropTypes from "prop-types";

const Button = ({ label, onClick, children, name, variant = 'green' }) => {
  const styles = {
    green: 'bg-green text-white hover:bg-opacity-90',
    red: 'bg-red-500 text-white hover:bg-red-600',
  };

  return (
    <div className="button">
      <button
        className={`py-2 px-6 inline-flex items-center gap-x-2 text-sm font-bold rounded-lg border border-transparent focus:outline-none disabled:opacity-50 disabled:pointer-events-none shadow hover:shadow-md shadow-gray-500/50 ${styles[variant]
          }`}
        onClick={onClick}
        name={name}
      >
        {children || label}
      </button>
    </div>
  );
};

Button.propTypes = {
  label: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.node,
  name: PropTypes.string,
  variant: PropTypes.oneOf(['green', 'red']),
};

export default Button;
