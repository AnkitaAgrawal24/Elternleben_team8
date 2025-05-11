import { useEffect, useState } from "react";
import axios from "axios";
//import WebinarRegistrationModal from "../components/WebinarRegisterationModal";

export default function WebinarBookingPage() {
  const [webinars, setWebinars] = useState([]);
  const [selectedWebinar, setSelectedWebinar] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false); // Modal visibility state

  // const BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const MOCK_API_URL = import.meta.env.VITE_MOCK_API_URL;

  useEffect(() => {
    fetchWebinars();
  }, []);

  const fetchWebinars = async () => {
    try {
      const res = await axios.get(`${MOCK_API_URL}/webinars`);
      setWebinars(res.data);
    } catch (error) {
      console.error("Error fetching webinars:", error);
    }
  };

  const handleRegister = async () => {
    if (!name || !email || !selectedWebinar) {
      alert("Bitte geben Sie Name und E-Mail ein.");
      return;
    }

    try {
      setLoading(true);
      const nameParts = name.split(" ");
      const first_name = nameParts[0];
      const last_name =
        nameParts.length > 1 ? nameParts.slice(1).join(" ") : null;
      const response = await axios.post(
        `${MOCK_API_URL}/webinars/${selectedWebinar.uuid}/registrants`,
        {
          email: email,
          first_name: first_name,
          last_name: last_name,
        }
      );

      alert(
        `✅ Erfolgreich für das Webinar "${selectedWebinar.topic}" registriert.`
      );

      setShowModal(false); // Close the modal after successful registration
      setSelectedWebinar(null);
      setName("");
      setEmail("");
    } catch (error) {
      console.error("Registrierung fehlgeschlagen:", error);
      alert("❌ Registrierung fehlgeschlagen. Bitte erneut versuchen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-2">
      <h1 className="text-3xl font-bold text-center mb-10">
        Verfügbare Webinare
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {webinars.map((webinar) => (
          <div
            key={webinar.uuid}
            className="p-6 border rounded-lg shadow-lg hover:shadow-2xl transition duration-300 cursor-pointer"
            onClick={() => {
              setSelectedWebinar(webinar);
              setShowModal(true);
            }}
          >
            <h2 className="text-2xl font-bold">{webinar.topic}</h2>
            <p className="text-gray-700 mt-2">
              {new Date(webinar.start_time).toLocaleString("de-DE", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <p className="mt-2 text-gray-600">{webinar.agenda}</p>
          </div>
        ))}
      </div>

      {/* Modal for booking */}
      {showModal && selectedWebinar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowModal(false)} // Close on background click
        >
          <div
            className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()} // Prevent modal from closing on inner click
          >
            <h2 className="text-2xl font-bold mb-4">Webinar buchen</h2>
            <p className="mb-4">
              <strong>{selectedWebinar.topic}</strong>
              <br />
              {new Date(selectedWebinar.start_time).toLocaleString("de-DE", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>

            <input
              type="text"
              placeholder="Ihr Name"
              className="w-full p-2 border rounded mb-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Ihre E-Mail"
              className="w-full p-2 border rounded mb-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              onClick={handleRegister}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow w-full"
            >
              {loading ? "Wird gebucht..." : "✅ Jetzt registrieren"}
            </button>

            <button
              onClick={() => setShowModal(false)}
              className="mt-4 text-red-600 hover:underline w-full"
            >
              Abbrechen
            </button>
          </div>
        </div>
      )}
      {/* {selectedWebinar && (
        <WebinarRegistrationModal
          webinar={selectedWebinar}
          onClose={() => setSelectedWebinar(null)}
        />
      )} */}
    </div>
  );
}
