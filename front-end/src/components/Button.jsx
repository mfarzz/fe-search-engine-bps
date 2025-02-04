import PropTypes from "prop-types";

const Button = ({ label, onClick, children, name, variant = 'cyan', className = '' }) => {
  const styles = {
    cyan: 'bg-cyan-500 hover:bg-cyan-600 text-white border-cyan-400/20',
    blue: 'bg-blue-500 hover:bg-blue-600 text-white border-blue-400/20',
    red: 'bg-red-500 hover:bg-red-600 text-white border-red-400/20',
    green: 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-400/20'
  };

  return (
    <button
      className={`
        py-2 px-6
        inline-flex items-center gap-x-2
        text-sm font-semibold
        rounded-2xl
        h-10
        border
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent
        disabled:opacity-50 disabled:pointer-events-none
        backdrop-blur-sm
        shadow-lg shadow-black/10
        ${styles[variant]}
        ${className}
      `}
      onClick={onClick}
      name={name}
    >
      {children || label}
    </button>
  );
};

Button.propTypes = {
  label: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.node,
  name: PropTypes.string,
  variant: PropTypes.oneOf(['cyan', 'blue', 'red', 'green']),
  className: PropTypes.string
};

export default Button;