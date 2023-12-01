import React, { useState } from "react";
import "../SignUp/SignUp.css";
import axios from 'axios';
import { UserUtils } from "../user.utils";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom';
const PatientView = () => {
    const navigate = useNavigate();
    const [doctorId, setDoctorId] = useState("");

    const handleButtonClick = (action) => {
      switch (action) {
        case 'create':
          // Navigate to the page for creating an appointment
          navigate('/createapp');
          break;
        case 'delete':
          // Navigate to the page for deleting an appointment
          navigate('/CancelAppointment');
          break;
        case 'update':
          // Navigate to the page for updating an appointment
          navigate('/appointments/:appID');
          break;
        case 'list':
          // Navigate to the page for listing all appointments
          navigate('/ListDrApp');
          break;
        case 'listDoctors':
          // Navigate to the page for listing all available doctors
          navigate('/selectdr');
          break;
          case 'listmyapp':
            // Navigate to the page for listing all available doctors
            navigate('/patients/:patientID');
            break;
            case 'listavslots':
              // Navigate to the page for listing all available doctors
              console.log("go to  slots");
              navigate('/doctors/available-slots', {
                state: {
                  doctorID: doctorId,
                },
              });
              break;
        default:
          // Handle other cases or provide a default action
          break;
      }
    };
    return (
      <div>
        <h2>Welcome Dear Patient :) </h2>
        <br></br>
        <div>
      <button onClick={() => handleButtonClick('create')}>Create an Appointment</button>
      <br />
      <br />
      <button onClick={() => handleButtonClick('delete')}>Delete an Appointment</button>
      <br />
      <br />
      <button onClick={() => handleButtonClick('update')}>Update an Appointment</button>
      <br />
      <br />
      <button onClick={() => handleButtonClick('list')}>List Dr's Appointmnets</button>
      <br />
      <br />
      <button onClick={() => handleButtonClick('listDoctors')}>Select DR</button> 
      <br></br>
      <br></br>
      <button onClick={() => handleButtonClick('listmyapp')}>List Patient Appointments</button> 
      <br></br>
      <br></br>
      <input type="number"
         value={doctorId}
         onChange={(e) => setDoctorId(e.target.value)}
      ></input>
      <button onClick={() => handleButtonClick('listavslots')}>List Avaiable Slots</button> 
    </div>
      </div>
    );
  };
export default PatientView;
