import React, { useState } from "react";

const ClinicReservation = () => {
  const [doctors, setDoctors] = useState([
    {
      id: 1,
      name: "Dr. Smith",
      schedule: [
        { day: "Monday", time: "10:00 AM" },
        { day: "Wednesday", time: "2:00 PM" },
      ],
    },
    {
      id: 2,
      name: "Dr. Johnson",
      schedule: [
        { day: "Tuesday", time: "9:30 AM" },
        { day: "Thursday", time: "3:30 PM" },
      ],
    },
  ]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setSelectedSlot(null);
  };
  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
  };

  return (
    <div>
      <h2>Clinic Reservation System</h2>
      <div>
        <h3>Doctors:</h3>
        <ul>
          {doctors.map((doctor) => (
            <li key={doctor.id}>
              <button onClick={() => handleDoctorSelect(doctor)}>
                {doctor.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
      {selectedDoctor && (
        <div>
          <h3>{`Available Slots for ${selectedDoctor.name}:`}</h3>
          <ul>
            {selectedDoctor.schedule.map((slot, index) => (
              <li key={index}>
                <button
                  onClick={() => handleSlotSelect(slot)}
                  disabled={
                    selectedSlot &&
                    selectedSlot.day === slot.day &&
                    selectedSlot.time === slot.time
                  }
                >{`${slot.day} - ${slot.time}`}</button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {selectedSlot && (
        <div>
          <h3>Your Reservation:</h3>
          <p>{`Doctor: ${selectedDoctor.name}`}</p>
          <p>{`Slot: ${selectedSlot.day} - ${selectedSlot.time}`}</p>
        </div>
      )}
    </div>
  );
};

export default ClinicReservation;
