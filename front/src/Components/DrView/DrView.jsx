import React, { useState } from "react";
import "../SignUp/SignUp.css";
import axios from 'axios';
import { UserUtils } from "../user.utils";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const DrView = () => {
  const navigate = useNavigate();

    const handleButtonClick = (action) => {
      switch (action) {
        case 'insertslot':
          // Navigate to the page for creating an appointment
          navigate('/DrInserSlot');
          break;
        }
    };
    return (
      <div>
        <h2>Welcome Dear Doctor :) </h2>
        <br></br>
        <div>
      <button onClick={() => handleButtonClick('insertslot')}>Insert Slot</button> 
    </div>
      </div>
    );
  };
export default DrView;
