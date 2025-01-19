import { useLocation } from "react-router-dom";

const NotFound = () => {
    const location = useLocation();

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="mb-6">
                    <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">Page Not Found</h2>
                    <p className="text-gray-600">
                        The page <span className="font-semibold">{location.pathname}</span> could not be found.
                    </p>
                </div>
                <div className="border-t border-gray-200 pt-6">
                    <p className="text-gray-500">
                    Please check the URL for proper spelling and capitalization.
                    If you&apos;re having trouble locating a destination, try visiting the{" "}
                        <a href="/home" className="text-blue-500 hover:text-blue-600">
                            home page
                        </a>.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default NotFound;