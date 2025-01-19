import { useState } from 'react';
import PropTypes from 'prop-types';

const ExpandableText = ({ text, maxLength = 50 }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!text || text.length <= maxLength) {
        return <span className="text-start">{text}</span>;
    }

    const toggleExpanded = (e) => {
        e.preventDefault();
        setIsExpanded(!isExpanded);
    };

    return (
        <span className="text-start">
            {isExpanded ? text : `${text.slice(0, maxLength-2)}`}
            <button
                onClick={toggleExpanded}
                className="text-blue-500 hover:text-blue-700 text-base font-medium inline"
            >
                {isExpanded ? "...See Less" : " ... See More"}
            </button>
        </span>
    );
};

ExpandableText.propTypes = {
    text: PropTypes.string,
    maxLength: PropTypes.number,
};

export default ExpandableText;