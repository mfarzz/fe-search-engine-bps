import { memo } from "react";

const CardLayanan = memo(({ nama, deskripsi, link, gambar }) => {
    return (
        <div className="flex flex-col bg-white border shadow-lg rounded-xl w-[700px] hover:bg-gray-100 transition-colors">
            <div className="grid grid-cols-12 gap-1">
                <div className="col-span-10">
                    <div className="p-4 md:p-2 ml-2">
                        <h3 className="text-lg font-bold text-gray-800">{nama}</h3>
                        <a
                            className="mt-1 inline-flex items-center gap-x-1 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-700 hover:underline focus:outline-none focus:text-blue-700"
                            rel="noopener noreferrer"
                            href={link}
                            target="_blank"
                        >
                            {link}
                            <svg
                                className="shrink-0 size-4"
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
                                <path d="m9 18 6-6-6-6"></path>
                            </svg>
                        </a>
                    </div>
                    <div className="ml-4 mb-4">
                        <p className="mt-2 text-gray-500">{deskripsi}</p>
                    </div>
                </div>
                <div className="col-span-2 w-50 h-40 mr-4">
                    <img
                        src={gambar}
                        alt={nama}
                        className="mt-4 rounded-sm object-cover w-full h-full"
                        loading="lazy"
                    />
                </div>
            </div>
        </div>
    );
});

CardLayanan.displayName = 'Card';
export default Card;