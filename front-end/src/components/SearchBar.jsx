import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Search, Clock, X } from 'lucide-react';
import { getKueri, hapusKueri } from '../services/pencarianLink.service';
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
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []); 

    useEffect(() => {
        setUserInput(search);
    }, [search]);

    useEffect(() => {
        const fetchSearchHistory = async () => {
            setLoading(true);
            try {
                const result = await getKueri();
                if (result.success) {
                    const formattedHistory = result.data.map(item => ({
                        query: item.query,
                        icon: Clock
                    }));
                    setSearchHistory(formattedHistory);
                    setFilteredSearchHistory(formattedHistory); // Initialize filtered history
                    setError(null);
                } else {
                    setError('Failed to load search history');
                }
            } catch (err) {
                setError('Failed to load search history');
                console.error('Error fetching search history:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchSearchHistory(); // Fetch immediately when component mounts
    }, []);

    useEffect(() => {
        if (userInput.trim() === "") {
            setFilteredSearchHistory(searchHistory);
        } else {
            const filtered = searchHistory.filter((item) =>
                item.query.toLowerCase().includes(userInput.toLowerCase())
            );
            setFilteredSearchHistory(filtered);
        }
    }, [userInput, searchHistory]);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setUserInput(value);
        setSearch(value);
        setSelectedIndex(-1);
        setIsDropdownVisible(true); // Show dropdown when typing
    };

    const handleHistoryItemClick = useCallback((query) => {
        setSearch(query);
        setUserInput(query);
        setIsDropdownVisible(false);
        setSelectedIndex(-1);
        onSearch(query); // Always trigger search when clicking history item
    }, [setSearch, onSearch]);

    const handleKeyDown = (e) => {
        if (!isDropdownVisible && e.key !== 'Enter') {
            setIsDropdownVisible(true);
            return;
        }

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
                setUserInput(filteredSearchHistory[newIndex].query);
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (selectedIndex === -1) {
                setSelectedIndex(filteredSearchHistory.length - 1);
                if (filteredSearchHistory.length > 0) {
                    const query = filteredSearchHistory[filteredSearchHistory.length - 1].query;
                    setSearch(query);
                    setUserInput(query);
                }
            } else {
                const newIndex = selectedIndex === 0 ? filteredSearchHistory.length - 1 : selectedIndex - 1;
                setSelectedIndex(newIndex);
                if (filteredSearchHistory[newIndex]) {
                    const query = filteredSearchHistory[newIndex].query;
                    setSearch(query);
                    setUserInput(query);
                }
            }
        } else if (e.key === 'Enter') {
            if (selectedIndex >= 0 && filteredSearchHistory[selectedIndex]) {
                const selectedItem = filteredSearchHistory[selectedIndex];
                handleHistoryItemClick(selectedItem.query);
            } else if (search.trim()) {
                setIsDropdownVisible(false);
                setUserInput(search);
                onSearch(search);
            }
            setSelectedIndex(-1);
        }
    };

    const handleDeleteHistory = async (e, query) => {
        e.stopPropagation();
        try {
            await hapusKueri(query);
            const result = await getKueri();
            if (result.success) {
                const formattedHistory = result.data.map(item => ({
                    query: item.query,
                    icon: Clock
                }));
                setSearchHistory(formattedHistory);
                setFilteredSearchHistory(formattedHistory);
            }
        } catch (err) {
            setError('Failed to delete search history');
            console.error('Error deleting search history:', err);
        }
    };

    const memoizedSearchHistory = useMemo(() => {
        const escapeRegExp = (string) => {
            return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        };
    
        return filteredSearchHistory.map((item, index) => {
            const Icon = item.icon || Clock;
            const parts = item.query.split(new RegExp(`(${escapeRegExp(userInput)})`, 'gi'));
    
            return (
                <div
                    key={index}
                    className={`flex items-center px-4 py-2 cursor-pointer group${
                        selectedIndex === index ? 'bg-blue-100' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => handleHistoryItemClick(item.query)}
                    role="option"
                    aria-selected={selectedIndex === index}
                >
                    <Icon className="w-4 h-4 text-gray-400 mr-3" />
                    <div className="flex flex-col flex-grow">
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
                    <button
                        className="p-1 rounded-full hover:bg-gray-200 opacity-80 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => handleDeleteHistory(e, item.query)}
                        aria-label="Delete search history"
                    >
                        <X className="w-4 h-4 text-gray-500" />
                    </button>
                </div>
            );
        });
    }, [filteredSearchHistory, selectedIndex, userInput, handleHistoryItemClick]);

    return (
        <div className="max-w-2xl mx-auto relative search-container" ref={searchBarRef}>
            <div
                className="flex items-center w-full px-4 py-2 bg-white rounded-full border hover:shadow-md focus-within:shadow-md cursor-pointer"
                onClick={() => setIsDropdownVisible(true)}
            >
                <Search className="w-5 h-5 text-gray-500 mr-3" />
                <input
                    type="text"
                    value={userInput}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    className="flex-grow outline-none text-gray-700"
                    placeholder="Search Link"
                    aria-label="Search input"
                    aria-expanded={isDropdownVisible}
                    role="combobox"
                    aria-controls="search-listbox"
                    aria-autocomplete="list"
                />
            </div>

            {isDropdownVisible && (
                <div
                    id="search-listbox"
                    className="absolute w-full mt-1 bg-white rounded-2xl shadow-lg border overflow-hidden z-10"
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