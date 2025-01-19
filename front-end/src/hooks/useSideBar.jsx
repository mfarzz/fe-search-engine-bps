import { useState } from "react";

const useSidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen((prev) => !prev);
    };

    return {
        isOpen,
        toggleSidebar,
    };
};

export default useSidebar;