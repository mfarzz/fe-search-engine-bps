import ButtonGreen from "./Button";
import { MessageCirclePlus, X } from "lucide-react";
import TextArea from "./TextArea";
import useFeedback from "../hooks/useFeedback"; // Import custom hook

const Feedback = () => {
  const { isOpen, togglePopup } = useFeedback(); // Menggunakan custom hook

  return (
    <div>
      <button
        onClick={togglePopup}
        className="fixed bottom-20 right-4 z-50 p-3  bg-green text-white rounded-full hover:bg-white hover:text-green hover:border-green hover:border-2 transition-colors"
      >
        <MessageCirclePlus size={25} className="w-8 h-8" />
      </button>

      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={togglePopup}
            aria-hidden="true"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
              <div className="flex justify-between items-center border-b p-4">
                <h2 className="text-lg font-semibold text-gray-800">Feedback</h2>
                <button
                  onClick={togglePopup}
                  className="text-gray-500 hover:text-gray-800"
                >
                  <X />
                </button>
              </div>

              <div className="pt-4 pl-8 pb-4 justify-center pr-5">
                <TextArea label="Saran" placeholder="Masukkan Saran Anda terhadap Website Ini" />
                <div className="mt-4 ml-40">
                  <ButtonGreen onClick={togglePopup} label="Kirim" />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>

    
  );
};

export default Feedback;
