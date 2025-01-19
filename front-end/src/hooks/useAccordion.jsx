import { useState } from 'react';

const useAccordion = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);

  const toggleAccordion = () => {
    setIsOpen(prevState => !prevState);
  };

  return { isOpen, toggleAccordion };
};

export default useAccordion;
