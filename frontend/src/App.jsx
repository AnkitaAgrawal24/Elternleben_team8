import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";

import "./App.css";
import ChatbotPage from "./pages/ChatbotPage";
import Home from "./pages/Home";

import ExpertBookingPage from "./pages/ExpertBookingPage";
import WebinarBookingPage from "./pages/WebinarBookingPage";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/schedule" element={<ExpertBookingPage />} />
          <Route path="/webinars" element={<WebinarBookingPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
