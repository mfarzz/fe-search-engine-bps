const Navbar = () => {

    return (
        <div className="navbar">
            <header className="fixed top-0 left-0 w-full bg-blue-premier text-sm py-3 shadow z-10">
                <nav className="max-w-[85rem] w-full mx-auto px-4 flex items-center justify-between">
                    <a
                        className="flex items-center gap-x-2 text-xl font-semibold text-white focus:outline-none focus:opacity-80"
                        href="/home"
                        aria-label="Brand"
                    >
                        <svg
                            className="w-10 h-auto"
                            width="100"
                            height="100"
                            viewBox="0 0 100 100"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        ></svg>
                        <img src="src/assets/logo.png" alt="Logo" className="w-11 h-10 mr-1" />
                        <div className="grid grid-rows-2 grid-flow-col gap-0">
                            <div className="text-xl italic font-bold">BADAN PUSAT STATISTIK</div>
                            <div className="text-base italic font-bold">PROVINSI SUMATERA BARAT</div>
                        </div>
                    </a>
                </nav>
            </header>
        </div>
    );
};

export default Navbar;
