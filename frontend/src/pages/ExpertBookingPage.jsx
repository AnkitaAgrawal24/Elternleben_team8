import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

export default function ExpertBookingPage() {
  const [experts, setExperts] = useState([]);
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [showModal, setShowModal] = useState(false); // To control modal visibility

  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [client_name, setClientName] = useState("");
  const [client_email, setClientEmail] = useState("");
  const [client_phone, setClientPhone] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchExperts();
  }, []);

  const fetchExperts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_MOCK_API_URL}/experts/available`
      );
      console.log("Fetched Experts:", response.data);
      setExperts(response.data);
    } catch (error) {
      console.error("Failed to load experts:", error);
    }
  };

  const fetchSlots = async (expertId) => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_MOCK_API_URL
        }/experts/${expertId}/available-slots`
      );
      setSlots(response.data);
    } catch (error) {
      console.error("Failed to fetch slots:", error);
    }
  };

  const handleExpertSelect = (expert) => {
    setSelectedExpert(expert);
    setSelectedSlot("");
    setSlots([]);
    fetchSlots(expert.uuid);
    console.log("Selected Expert:", expert);
  };

  const handleSlotClick = (selectedTime) => {
    setSelectedSlot(selectedTime);
    console.log("Selected Slot:", selectedTime);
  };

  // const handleNameChange = (event) => {
  //   setName(event.target.value);
  //   console.log("Name:", event.target.value);
  // };

  // const handleEmailChange = (event) => {
  //   setEmail(event.target.value);
  //   console.log("Email:", event.target.value);
  // };

  const handleClientNameChange = (event) => {
    setClientName(event.target.value);
    console.log("Name:", event.target.value);
  };

  const handleClientEmailChange = (event) => {
    setClientEmail(event.target.value);
    console.log("Email:", event.target.value);
  };

  const handleClientPhoneChange = (event) => {
    setClientPhone(event.target.value);
    console.log("Phone:", event.target.value);
  };

  const handleConfirmBooking = async () => {
    if (!selectedExpert || !selectedSlot || !client_name || !client_email)
      return alert("Bitte füllen Sie alle Felder aus.");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_MOCK_API_URL}/bookings/new`,
        {
          expert_id: selectedExpert.uuid,
          start_datetime: selectedSlot,
          client_name: client_name,
          client_email: client_email,
          client_phone: client_phone,
          service: "consultation",
        }
      );

      alert(`✅ Termin erfolgreich bei ${selectedExpert.name} gebucht!`);
      navigate("/");
    } catch (error) {
      console.error("Booking failed:", error);
      if (error.response && error.response.data) {
        console.error("Server response:", error.response.data); // Log the server's error
        alert(`Buchung fehlgeschlagen: ${JSON.stringify(error.response.data)}`);
      } else {
        alert("❌ Buchung fehlgeschlagen.");
      }
    }
  };

  return (
    <div className="p-6 space-y-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Experten auswählen</h1>

      {experts.map((expert) => (
        <button
          key={expert.uuid}
          onClick={() => handleExpertSelect(expert)}
          className={`w-full text-left px-4 py-2 rounded shadow mb-2 ${
            selectedExpert?.uuid === expert.uuid
              ? "bg-blue-600 text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          👨‍⚕️ {expert.name}
        </button>
      ))}

      {selectedExpert && (
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">
            Verfügbare Zeiten für {selectedExpert.name}
          </h2>

          {slots.map((slot, index) => (
            <button
              // key={slot.expertuuid}
              key={`${slot.start_datetime}-${slot.end_datetime}-${index}`}
              onClick={() => handleSlotClick(slot.start_datetime)}
              className={`px-4 py-2 rounded w-full text-left shadow ${
                selectedSlot === slot.start_datetime
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              🕒
              {new Date(slot.start_datetime).toLocaleString("de-DE", {
                year: "numeric",
                month: "numeric",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              -{" "}
              {new Date(slot.end_datetime).toLocaleString("de-DE", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </button>
          ))}

          {slots.length === 0 && <p>Keine verfügbaren Slots.</p>}
        </div>
      )}

      {selectedExpert && (
        <div className="space-y-2 mt-4">
          <h2 className="text-lg font-semibold">Ihre Informationen</h2>
          <input
            type="text"
            placeholder="Name"
            value={client_name}
            // onChange={(e) => setName(e.target.value)}
            onChange={handleClientNameChange}
            className="w-full p-2 border rounded"
          />
          <input
            type="email"
            placeholder="E-Mail"
            value={client_email}
            // onChange={(e) => setEmail(e.target.value)}
            onChange={handleClientEmailChange}
            className="w-full p-2 border rounded"
          />

          <input
            type="tel"
            placeholder="Telefon (Optional)"
            value={client_phone}
            onChange={handleClientPhoneChange}
            className="w-full p-2 border rounded"
          />

          <button
            onClick={handleConfirmBooking}
            className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
          >
            ✅ Termin bestätigen
          </button>
        </div>
      )}
    </div>
  );
}
