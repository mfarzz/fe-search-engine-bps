import PropTypes from "prop-types";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const generatePageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 3; // Show 3 pages at a time

        if (totalPages <= maxVisiblePages) {
            // Show all pages if total pages are within the limit
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            // Calculate the range of pages to show
            let startPage = Math.max(currentPage - 1, 1);
            let endPage = Math.min(startPage + 2, totalPages);

            // Adjust startPage if we're at the end
            if (endPage === totalPages) {
                startPage = Math.max(endPage - 2, 1);
            }

            // Add ellipsis and numbers
            if (startPage > 1) {
                pageNumbers.push("...");
            }
            
            for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(i);
            }

            if (endPage < totalPages) {
                pageNumbers.push("...");
            }
        }

        return pageNumbers;
    };

    const handleFirst = () => {
        onPageChange(1);
    };

    const handleLast = () => {
        onPageChange(totalPages);
    };

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
            {/* First page */}
            <button
                type="button"
                className="min-h-[38px] min-w-[38px] py-2 px-2.5 inline-flex justify-center items-center text-sm rounded-lg text-white/80 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-all duration-200"
                aria-label="First page"
                onClick={handleFirst}
                disabled={currentPage === 1}
            >
                <svg
                    className="size-5"
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
                    <path d="m11 17-5-5 5-5" />
                    <path d="m18 17-5-5 5-5" />
                </svg>
            </button>

            {/* Previous */}
            <button
                type="button"
                className="min-h-[38px] min-w-[38px] py-2 px-2.5 inline-flex justify-center items-center text-sm rounded-lg text-white/80 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-all duration-200"
                aria-label="Previous"
                onClick={handlePrevious}
                disabled={currentPage === 1}
            >
                <svg
                    className="size-5"
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
                    <path d="m15 18-6-6 6-6" />
                </svg>
            </button>

            {/* Page numbers */}
            <div className="flex items-center gap-x-1">
                {generatePageNumbers().map((page, index) => (
                    <button
                        key={index}
                        type="button"
                        className={`min-h-[38px] min-w-[38px] flex justify-center items-center py-2 px-3 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 
                            ${page === currentPage
                                ? 'bg-blue-500/80 text-white font-medium shadow-lg shadow-blue-500/30'
                                : typeof page === 'number'
                                    ? 'text-white/80 hover:text-white hover:bg-white/10'
                                    : 'text-white/50 pointer-events-none'
                            }`}
                        onClick={() => typeof page === 'number' && onPageChange(page)}
                        disabled={typeof page !== 'number'}
                    >
                        {page}
                    </button>
                ))}
            </div>

            {/* Next */}
            <button
                type="button"
                className="min-h-[38px] min-w-[38px] py-2 px-2.5 inline-flex justify-center items-center text-sm rounded-lg text-white/80 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-all duration-200"
                aria-label="Next"
                onClick={handleNext}
                disabled={currentPage === totalPages}
            >
                <svg
                    className="size-5"
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
                    <path d="m9 18 6-6-6-6" />
                </svg>
            </button>

            {/* Last page */}
            <button
                type="button"
                className="min-h-[38px] min-w-[38px] py-2 px-2.5 inline-flex justify-center items-center text-sm rounded-lg text-white/80 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-all duration-200"
                aria-label="Last page"
                onClick={handleLast}
                disabled={currentPage === totalPages}
            >
                <svg
                    className="size-5"
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
                    <path d="m13 17 5-5-5-5" />
                    <path d="m6 17 5-5-5-5" />
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