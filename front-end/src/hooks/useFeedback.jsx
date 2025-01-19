import { useState } from "react";

const useFeedback = () => {
  const [isOpen, setIsOpen] = useState(false);

  const togglePopup = () => {
    setIsOpen((prev) => !prev);
  };

  return {
    isOpen,
    togglePopup,
  };
};

export default useFeedback;
