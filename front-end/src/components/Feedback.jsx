import ButtonGreen from "./Button";
import { MessageCirclePlus, X } from "lucide-react";
import TextArea from "./TextArea";
import useFeedback from "../hooks/useFeedback";
import { motion, AnimatePresence } from "framer-motion";
import { tambahFeedback } from "../services/feedback.service";
import Swal from "sweetalert2";
import { useState } from "react";

const Feedback = () => {
  const { isOpen, togglePopup } = useFeedback();
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!feedback.trim()) {
        Swal.fire({
          icon: "warning",
          title: "Oops...",
          text: "Silakan masukkan feedback Anda terlebih dahulu",
          confirmButtonColor: "#2563EB",
        });
        return;
      }
      await tambahFeedback(feedback);
      setFeedback(""); // Reset feedback after successful submission
      togglePopup();
      Swal.fire({
        icon: "success",
        title: "Terima Kasih",
        text: "Feedback Anda telah terkirim",
        confirmButtonColor: "#2563EB",
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Terjadi kesalahan saat mengirim feedback",
        confirmButtonColor: "#2563EB",
      });
    }
  };

  const handleChange = (e) => {
    setFeedback(e.target.value);
  };

  return (
    <div>
      <motion.button
        onClick={togglePopup}
        className="fixed bottom-20 right-4 z-20 p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:from-blue-700 hover:to-purple-700 shadow-lg backdrop-blur-sm transition-all duration-300 border border-white/20"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <MessageCirclePlus size={25} className="w-8 h-8" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-10"
              onClick={togglePopup}
              aria-hidden="true"
            />

            <motion.div 
              className="fixed inset-0 flex justify-center items-center z-50 p-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", duration: 0.5 }}
            >
              <div className="bg-gradient-to-br from-blue-900/90 to-purple-900/90 rounded-xl shadow-xl max-w-md w-full backdrop-blur-md border border-white/10">
                <div className="flex justify-between items-center border-b border-white/10 p-4">
                  <h2 className="text-lg font-semibold text-white" id="feedback">Feedback</h2>
                  <motion.button
                    onClick={togglePopup}
                    className="text-white/70 hover:text-white transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.button>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    <TextArea 
                      label="Feedback" 
                      name="feedback"
                      id="Feedback"

                      placeholder="Masukkan Saran Anda terhadap Website Ini"
                      value={feedback}
                      onChange={handleChange}
                      className="bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-white/40 focus:ring-white/40 z-auto"
                    />
                    <div className="flex justify-end mt-6">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ButtonGreen 
                          onClick={handleSubmit} 
                          type="submit"
                          label="Kirim"
                          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium px-6 py-2 rounded-lg shadow-lg transition-all duration-300"
                        />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Feedback;