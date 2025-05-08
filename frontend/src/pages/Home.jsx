import React, { useState } from "react";
import ChatbotPage from "./ChatbotPage";
import ChatInput from "../components/ChatInput";
import { FiMessageSquare } from "react-icons/fi";
import Logo from "../assets/images/elternleben-logo.jpg";
import banner from "../assets/images/banner.webp";
import axios from "axios";

export default function Home() {
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatContainerRef = React.useRef(null);

  const speakWelcomeMessage = (message) => {
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = "en-GB";
    speechSynthesis.speak(utterance);
  };

  const openChatbot = () => {
    setChatbotOpen(true);
    // Optionally speak a welcome message when the popup opens
    speakWelcomeMessage("Hello! How can I help you?");
  };

  const closeChatbot = () => {
    setChatbotOpen(false);
    setMessages([]); // Optionally clear messages on close
  };

  const handleSend = async (userInput) => {
    if (!userInput.trim()) return;

    const userMessage = { role: "user", content: userInput };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/chat`,
        { message: userInput }
      );

      const botReply = response.data.botReply;
      const botMessage = { role: "assistant", content: botReply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error communicating with chatbot:", error);
      const errorMessage = {
        role: "assistant",
        content: "⚠️ Oops! Something went wrong. Try again later.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      // Scroll to the latest message
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop =
          chatContainerRef.current.scrollHeight;
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-sky-50 to-white font-sans">
      {/* Navbar */}
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <img src={Logo} alt="" />
        <nav className="space-x-6 text-sm text-gray-600">
          <a href="#" className="hover:text-sky-600">
            Home
          </a>
          <a href="#" className="hover:text-sky-600">
            Webinars
          </a>
          <a href="#" className="hover:text-sky-600">
            Consultations
          </a>
        </nav>
      </header>

      {/* Hero section */}
      <section className="w-full text-center ">
        <img src={banner} alt="" />
      </section>

      {/* Floating Chatbot Button */}
      <button
        onClick={openChatbot}
        className="fixed bottom-6 right-6 bg-sky-600 hover:bg-sky-700 text-white p-4 rounded-full shadow-xl z-50 flex items-center justify-center w-14 h-14"
        aria-label="Open Chatbot"
        title="Open AI Assistant"
      >
        {/* <FiMessageSquare size={24} /> */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 10v-3m0 0l-4 3m4-3h3m9 8v-3m0 0l4 3m-4-3h-3M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>

      {/* Chatbot Modal */}
      {chatbotOpen && (
        <div className="fixed inset-0 bg-black/40 flex justify-end z-50">
          <div className="w-full max-w-md h-full bg-white p-4 shadow-lg flex flex-col justify-end">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">👋 Need Help?</h3>
              <button
                onClick={() => setChatbotOpen(false)}
                className="text-gray-500 hover:text-red-500"
              >
                ✖
              </button>
            </div>
            <ChatbotPage />
          </div>
        </div>
      )}
    </div>
  );
}
