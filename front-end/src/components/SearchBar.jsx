import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Search, Clock } from 'lucide-react';
import { getKueri } from '../services/pencarianLink.service';
import PropTypes from 'prop-types';

const SearchBar = ({ search, setSearch, onSearch }) => {
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [searchHistory, setSearchHistory] = useState([]);
    const [filteredSearchHistory, setFilteredSearchHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [userInput, setUserInput] = useState('');
    const searchBarRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchBarRef.current && !searchBarRef.current.contains(e.target)) {
                setIsDropdownVisible(false);
                setSelectedIndex(-1);
                setSearch(userInput);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [userInput, setSearch]); // Added setSearch to dependencies

    useEffect(() => {
        const fetchSearchHistory = async () => {
            setLoading(true);
            try {
                const result = await getKueri();
                setSearchHistory(result.data);
                setError(null);
            } catch (err) {
                setError('Failed to load search history');
                console.error('Error fetching search history:', err);
            } finally {
                setLoading(false);
            }
        };
        if (isDropdownVisible) {
            fetchSearchHistory();
        }
    }, [isDropdownVisible]);

    useEffect(() => {
        if (search.trim() === "") {
            setFilteredSearchHistory(searchHistory);
        } else {
            const filtered = searchHistory.filter((item) =>
                item.query.toLowerCase().includes(userInput.toLowerCase())
            );
            setFilteredSearchHistory(filtered);
        }
    }, [userInput, searchHistory, search]); // Added search to dependencies

    const handleInputChange = (e) => {
        const value = e.target.value;
        setUserInput(value);
        setSearch(value);
        setSelectedIndex(-1);
    };

    const handleHistoryItemClick = useCallback((query) => {
        setSearch(query);
        setUserInput(query);
        setIsDropdownVisible(false);
        setSelectedIndex(-1);
        onSearch(query);
    }, [setSearch, onSearch]); // Memoize handleHistoryItemClick with its dependencies

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            setIsDropdownVisible(false);
            setSelectedIndex(-1);
            setSearch(userInput);
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            const newIndex = selectedIndex === filteredSearchHistory.length - 1 ? 0 : selectedIndex + 1;
            setSelectedIndex(newIndex);
            
            if (filteredSearchHistory[newIndex]) {
                setSearch(filteredSearchHistory[newIndex].query);
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (selectedIndex === -1) {
                setSelectedIndex(filteredSearchHistory.length - 1);
                if (filteredSearchHistory.length > 0) {
                    setSearch(filteredSearchHistory[filteredSearchHistory.length - 1].query);
                }
            } else {
                const newIndex = selectedIndex === 0 ? filteredSearchHistory.length - 1 : selectedIndex - 1;
                setSelectedIndex(newIndex);
                if (filteredSearchHistory[newIndex]) {
                    setSearch(filteredSearchHistory[newIndex].query);
                }
            }
        } else if (e.key === 'Enter') {
            if (selectedIndex >= 0 && filteredSearchHistory[selectedIndex]) {
                const selectedItem = filteredSearchHistory[selectedIndex];
                setSearch(selectedItem.query);
                setUserInput(selectedItem.query);
                setIsDropdownVisible(false);
                onSearch(selectedItem.query);
            } else if (search.trim()) {
                setIsDropdownVisible(false);
                setUserInput(search);
                onSearch(search);
            }
            setSelectedIndex(-1);
        }
    };

    const memoizedSearchHistory = useMemo(() => {
        return filteredSearchHistory.map((item, index) => {
            const Icon = item.icon || Clock;
            const parts = item.query.split(new RegExp(`(${userInput})`, 'gi'));

            return (
                <div
                    key={index}
                    className={`flex items-center px-4 py-2 cursor-pointer ${
                        selectedIndex === index ? 'bg-blue-100' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => handleHistoryItemClick(item.query)}
                    role="option"
                    aria-selected={selectedIndex === index}
                >
                    <Icon className="w-4 h-4 text-gray-400 mr-3" />
                    <span className="text-gray-700">
                        {parts.map((part, i) => (
                            part.toLowerCase() === userInput.toLowerCase() ? (
                                <span key={i} className="bg-yellow-200">{part}</span>
                            ) : (
                                part
                            )
                        ))}
                    </span>
                </div>
            );
        });
    }, [filteredSearchHistory, selectedIndex, userInput, handleHistoryItemClick]); // Added handleHistoryItemClick to dependencies

    return (
        <div className="max-w-2xl mx-auto relative search-container" ref={searchBarRef}>
            <div
                className="flex items-center w-full px-4 py-2 bg-white rounded-full border hover:shadow-md focus-within:shadow-md cursor-pointer"
                onClick={() => setIsDropdownVisible(true)}
            >
                <Search className="w-5 h-5 text-gray-500 mr-3" />
                <input
                    type="text"
                    value={search}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    className="flex-grow outline-none text-gray-700"
                    placeholder="Search Google or type a URL"
                    aria-label="Search input"
                    aria-expanded={isDropdownVisible}
                    role="combobox"
                    aria-controls="search-listbox"
                    aria-autocomplete="list"
                    name="search"
                />
            </div>

            {isDropdownVisible && (
                <div
                    id="search-listbox"
                    className="absolute w-full mt-1 bg-white rounded-2xl shadow-lg border overflow-hidden"
                    role="listbox"
                >
                    {error && (
                        <div className="text-red-500 text-sm p-4">
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <span className="animate-pulse"></span>
                    ) : (
                        memoizedSearchHistory
                    )}
                </div>
            )}
        </div>
    );
};

SearchBar.propTypes = {
    search: PropTypes.string.isRequired,
    setSearch: PropTypes.func.isRequired,
    onSearch: PropTypes.func.isRequired
};

export default SearchBar;