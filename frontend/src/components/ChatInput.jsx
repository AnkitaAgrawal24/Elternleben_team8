import { useState, useRef } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { FiSend, FiMic } from "react-icons/fi";

export default function ChatInput({ onSend, loading }) {
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const recognitionRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleStartRecording = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Voice recognition not supported in this browser.");
      return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev) => prev + " " + transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  // const handleFileChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setInput((prev) => prev + ` 📎 [Attached: ${file.name}]`);
  //   }
  // };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("File uploaded and embedded!");
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed");
    }
  };
  

  return (
    <div className="p-3 border-t flex gap-2 items-center relative">
      {/* + Button */}
      <div className="relative">
        <button
          onClick={() => setShowDropdown((prev) => !prev)}
          className="text-gray-500 hover:text-gray-700"
        >
          <AiOutlinePlusCircle size={24} />
        </button>

        {/* Dropdown menu */}
        {showDropdown && (
          <div className="absolute bottom-12 left-0 bg-white shadow-lg rounded-md py-2 w-36 text-sm z-10">
            <button
              onClick={() => fileInputRef.current.click()}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              📄 Upload File
            </button>
          </div>
        )}

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Text Area */}
      <textarea
        rows="2"
        placeholder="Type your message..."
        className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400 resize-none"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      {/* Mic Button */}
      <button
        onClick={handleStartRecording}
        className={`text-gray-500 hover:text-gray-700 ${
          isRecording ? "text-red-500 animate-pulse" : ""
        }`}
      >
        <FiMic size={24} />
      </button>

      {/* Send Button */}
      <button
        onClick={handleSend}
        disabled={loading}
        className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded flex items-center justify-center"
      >
        <FiSend size={20} />
      </button>
    </div>
  );
}
