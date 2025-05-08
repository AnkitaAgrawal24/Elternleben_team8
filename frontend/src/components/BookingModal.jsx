import React from "react";

const BookingModal = ({ expert, onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Buchung bestätigen</h2>
        <p className="mb-4">
          Möchten Sie sich für ein Gespräch mit <strong>{expert.name}</strong>{" "}
          buchen?
        </p>
        <div className="flex justify-between">
          <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">
            Abbrechen
          </button>
          <button
            onClick={() => onConfirm(expert)}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Bestätigen
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
