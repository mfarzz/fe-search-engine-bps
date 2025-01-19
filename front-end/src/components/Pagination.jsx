import PropTypes from "prop-types";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    return (
        <nav className="flex items-center gap-x-1" aria-label="Pagination">
            <button
                type="button"
                className="min-h-[38px] min-w-[38px] py-2 px-2.5 inline-flex justify-center items-center gap-x-1.5 text-sm rounded-lg text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-blue-premier focus:text-white disabled:opacity-50 disabled:pointer-events-none"
                aria-label="Previous"
                onClick={handlePrevious}
                disabled={currentPage === 1}
            >
                <svg
                    className="shrink-0 size-3.5"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="m15 18-6-6 6-6"></path>
                </svg>
                <span>Previous</span>
            </button>
            <div className="flex items-center gap-x-1">
                {Array.from({ length: totalPages }).map((_, index) => (
                    <button
                        key={index}
                        type="button"
                        className={`min-h-[38px] min-w-[38px] flex justify-center items-center text-gray-800 py-2 px-3 text-sm rounded-lg focus:outline-none focus:bg-blue-premier focus:text-white ${
                            currentPage === index + 1 ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
                        }`}
                        onClick={() => onPageChange(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
            <button
                type="button"
                className="min-h-[38px] min-w-[38px] py-2 px-2.5 inline-flex justify-center items-center gap-x-1.5 text-sm rounded-lg text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-blue-premier focus:text-white disabled:opacity-50 disabled:pointer-events-none"
                aria-label="Next"
                onClick={handleNext}
                disabled={currentPage === totalPages}
            >
                <span>Next</span>
                <svg
                    className="shrink-0 size-3.5"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="m9 18 6-6-6-6"></path>
                </svg>
            </button>
        </nav>
    );
};

Pagination.propTypes = {
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
