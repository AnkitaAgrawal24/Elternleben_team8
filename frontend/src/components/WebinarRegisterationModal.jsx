import { useState } from "react";
import axios from "axios";

export default function WebinarRegistrationModal({ webinar, onClose }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  //   const handleRegister = async () => {
  //     if (!name || !email) {
  //       alert("Bitte geben Sie sowohl Name als auch E-Mail ein.");
  //       return;
  //     }

  //     setLoading(true);
  //     try {
  //       const res = await axios.post(
  //         `${import.meta.env.VITE_BACKEND_URL}/webinars/${
  //           webinar.uuid
  //         }/registrants`,
  //         { name, email }
  //       );

  //       alert("✅ Erfolgreich registriert!");
  //       onClose(); // close modal after success
  //     } catch (error) {
  //       console.error("Registrierung fehlgeschlagen:", error);
  //       if (error.response?.data?.message) {
  //         alert(`Fehler: ${error.response.data.message}`);
  //       } else {
  //         alert("❌ Registrierung fehlgeschlagen.");
  //       }
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  const handleRegister = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/webinars/${
          selected.Webinar.uuid
        }/registrants`,
        // `${import.meta.env.VITE_BACKEND_URL}/webinars/${
        //   webinar.uuid
        // }/registrants`,

        {
          webinar_id: selectedWebinar.uuid,
          name,
          email,
        }
      );
      alert("✅ Registration successful!");
      onClose();
    } catch (error) {
      console.error("Registration failed:", error);
      alert("❌ Failed to register.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-2xl max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">
          Registrierung: {webinar.topic}
        </h2>

        <input
          type="text"
          placeholder="Ihr Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
        />

        <input
          type="email"
          placeholder="Ihre E-Mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            disabled={loading}
          >
            Abbrechen
          </button>
          <button
            onClick={handleRegister}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Wird gesendet..." : "Jetzt registrieren"}
          </button>
        </div>
      </div>
    </div>
  );
}
