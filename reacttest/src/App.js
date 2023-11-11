import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import SignIn from "../src/Components/SignIn/SignIn";
import SignUp from "../src/Components/SignUp/SignUp";
import ClinicReservation from "../src/Components/ClinicReservation/ClinicReservation";
import DoctorSchedule from "../src/Components/DoctorSchedule/DoctorSchedule";
import Layout from "../src/Components/Layout/Layout";
import Navbar from "../src/Components/Navbar/Navbar";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="signin" element={<SignIn />} />
        <Route path="doctorschedule" element={<DoctorSchedule />} />
        <Route path="clinicreservation" element={<ClinicReservation />} />
      </Routes>
    </Router>
  );
}

export default App;
