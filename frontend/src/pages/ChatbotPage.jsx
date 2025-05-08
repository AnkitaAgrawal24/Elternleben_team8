import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import ChatInput from "../components/ChatInput";

export default function ChatbotPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [webinarOptions, setWebinarOptions] = useState([]); //  Store webinar choices
  const [selectedWebinar, setSelectedWebinar] = useState(null); // Track selection
  const [suggestedOptions, setSuggestedOptions] = useState(null);

  const navigate = useNavigate();

  const handleSend = async (userInput) => {
    if (!userInput.trim()) return;
    if (/book.*expert/i.test(userInput) || /expert.*book/i.test(userInput)) {
      navigate("/schedule");
      return;
    }
    if (/view.*webinar/i.test(userInput) || /webinar.*view/i.test(userInput)) {
      navigate("/webinars");
      return;
    }

    const userMessage = { role: "user", content: userInput };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setSuggestedOptions(null);
    setWebinarOptions([]); // Clear any previous options

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/chat`,
        { message: userInput }
      );

      const botReply = response.data.botReply;
      const options = response.data.options;
      const webinars = response.data.options || [];

      const botMessage = { role: "assistant", content: botReply };
      setMessages((prev) => [...prev, botMessage]);

      // if (webinars.length > 0) {
      //   setWebinarOptions(webinars); // Show webinar buttons
      // }

      if (options) {
        setSuggestedOptions(options); // Display the suggestions
      }
    } catch (error) {
      console.error("Error communicating with chatbot:", error);
      const errorMessage = {
        role: "assistant",
        content: "⚠️ Oops! Something went wrong. Try again later.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleWebinarSelectFromChat = (webinarId) => {
    navigate(`/webinars`);
    console.log("Selected webinar from chat:", webinarId);
  };

  const handleConsultationSuggestionClick = () => {
    navigate("/schedule");
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-md px-4 py-2 rounded-lg shadow ${
              msg.role === "user"
                ? "bg-sky-500 text-white self-end ml-auto"
                : "bg-gray-100 text-gray-800 self-start mr-auto"
            }`}
          >
            {msg.content}
          </div>
        ))}

        {/* Display suggested options */}
        {suggestedOptions && (
          <div className="mt-4">
            {suggestedOptions.message && (
              <p className="text-gray-700 mb-2">{suggestedOptions.message}</p>
            )}
            {suggestedOptions.type === "webinar" &&
              suggestedOptions.data.length > 0 && (
                <div className="space-y-2">
                  {suggestedOptions.data.map((webinar) => (
                    <button
                      key={webinar.id}
                      onClick={() => handleWebinarSelectFromChat(webinar.id)}
                      className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-2 rounded w-full text-left"
                    >
                      📢 {webinar.title} –{" "}
                      {new Date(webinar.date).toLocaleDateString("de-DE")}
                    </button>
                  ))}
                  <button
                    onClick={() => navigate("/webinars")}
                    className="mt-2 text-blue-600 hover:underline block"
                  >
                    View All Webinars
                  </button>
                </div>
              )}
            {suggestedOptions.type === "consultation" && (
              <button
                onClick={handleConsultationSuggestionClick}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg shadow"
              >
                📅 Book a Consultation
              </button>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-around p-3 border-t">
        <button
          onClick={() => navigate("/schedule")}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 mx-2 rounded-lg shadow"
        >
          📅 Book a Consultation
        </button>
        <button
          onClick={() => navigate("/experts")}
          className="bg-purple-500 hover:bg-purple-600 text-white font-semibold px-4 mx-2 py-2 rounded-lg shadow"
        >
          🎥 Watch Videos
        </button>
        <button
          onClick={() => navigate("/webinars")}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 mx-2 rounded-lg shadow"
        >
          📢 View Webinars
        </button>
      </div>

      {/* Chat Input */}
      <ChatInput onSend={handleSend} loading={loading} />
    </div>
  );
}
