import Navbar from "/src/components/Navbar";
import Sidebar from "/src/components/SideBar";
import Footer from "/src/components/Footer";
import Scroll from "/src/components/Scroll";
import Feedback from "/src/components/Feedback";
import Accordion from "/src/components/Accordion";

const pertanyaan = [
    {
        pertanyaan: "Apa itu Sistem Search Engine BPS Sumbar?",
        jawaban:
            "Sistem Search Engine BPS Sumbar adalah platform pencarian yang dirancang untuk mengakses semua link yang terkait dengan Badan Pusat Statistik (BPS) Sumatera Barat.",
    },
    {
        pertanyaan: "Apakah semua orang dapat menambahkan link ke dalam sistem?",
        jawaban:
            "Hanya pengguna yang telah terverifikasi dan memiliki akun resmi yang dapat menambahkan link.",
    },
    {
        pertanyaan: "Bagaimana cara mengakses sistem ini?",
        jawaban: "Kamu dapat mengakses sistem melalui situs resmi BPS Sumbar.",
    },
    {
        pertanyaan: "Apakah sistem ini hanya mencakup data dari BPS Sumbar?",
        jawaban:
            "Ya, sistem ini difokuskan untuk mengakses link yang berkaitan dengan BPS Sumatera Barat. Namun, jika ada data nasional yang relevan dengan Sumatera Barat, link tersebut juga dapat dimasukkan.",
    },
];

function FAQ() {
    return (
        <>
            <Navbar />
            <div className="max-w-2xl mx-auto text-center mb-10 lg:mb-14 mt-20 p-2">
                <h2 className="text-2xl font-bold md:text-4xl md:leading-tight mt-12">
                    FAQ
                </h2>
                <p className="mt-1 text-gray-600">
                    Jawaban atas pertanyaan yang paling sering ditanyakan.
                </p>
            </div>
            <div className="max-w-2xl mx-auto mb-10">
                {pertanyaan.map((item, index) => (
                    <Accordion
                        key={index}
                        pertanyaan={item.pertanyaan}
                        jawaban={item.jawaban}
                    />
                ))}
            </div>
            <Sidebar />
            <Footer />
            <Scroll />
            <Feedback />
        </>
    );
}

export default FAQ;
