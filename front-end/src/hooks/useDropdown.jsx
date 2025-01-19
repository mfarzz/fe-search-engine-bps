import { useState } from 'react';

const useDropdown = (initialSelected = null) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(initialSelected);

  const toggleDropdown = () => {
    setIsOpen(prevState => !prevState);
  };

  const handleSelect = (option) => {
    setSelected(option);
    setIsOpen(false);
  };

  return {
    isOpen,
    selected,
    toggleDropdown,
    handleSelect
  };
};

export default useDropdown;
