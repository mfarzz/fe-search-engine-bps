import useAccordion from "../hooks/useAccordion";
import PropTypes from "prop-types";

const Accordion = ({ pertanyaan, jawaban }) => {
  const { isOpen, toggleAccordion } = useAccordion();

  return (
    <div className={`transition-all duration-300 ${isOpen ? "mt-4" : "mt-2"}`}>
      <div className={`hs-accordion ${isOpen ? "bg-blue" : ""} rounded-xl p-6`}>
        <button
          className="hs-accordion-toggle group pb-3 inline-flex items-center justify-between gap-x-3 w-full md:text-lg font-semibold text-start text-white/60 rounded-lg transition hover:text-white hover:translate-y-[-2px] focus:outline-none"
          aria-expanded={isOpen}
          onClick={toggleAccordion}
        >
          {pertanyaan}
          {isOpen ? (
            <svg
              className="shrink-0 size-5 text-white focus:text-white"
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
              <path d="m18 15-6-6-6 6" />
            </svg>
          ) : (
            <svg
              className="shrink-0 size-5 text-white group-hover:text-gray-500"
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
              <path d="m6 9 6 6 6-6" />
            </svg>
          )}
        </button>
        <div
          className={`hs-accordion-content overflow-hidden transition-[height] duration-300 ${isOpen ? "max-h-screen" : "max-h-0"}`}
          role="region"
        >
          <p className="text-white/70">{jawaban}</p>
        </div>
      </div>
    </div>
  );
};


Accordion.propTypes = {
  pertanyaan: PropTypes.string,
  jawaban: PropTypes.string,
};

export default Accordion;
