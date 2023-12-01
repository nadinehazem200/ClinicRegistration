import React, { useState } from "react";
import "../SignUp/SignUp.css";
import axios from 'axios';
import { UserUtils } from "../user.utils";
import { Navigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from 'react-router-dom'; // or the appropriate import for your library
import { useNavigate } from 'react-router-dom';

// ... Other imports ...

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const navv=useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());

    console.log(formJson);

    try {
      const response = await axios.post('http://localhost:8000/signup', {
        "username": formJson["name"],
        "password": formJson["password"],
        "userType": formJson["myRadio"]
      });

     
      console.log(response.data);

      UserUtils.curUserId = response.data["id"];
      UserUtils.curUserRole = response.data["role"];

      console.log(UserUtils.curUserId);
      console.log(UserUtils.curUserRole);
      if (formJson["myRadio"] === "patient") {
        // Navigate to the "patientview" page
        navv('/patientview');
      } else {
          navv('/drview');
      }
    } catch (error) {
      console.error('An error occurred during sign-in:', error.message);
      // Handle sign-in errors
    }


    console.log("Form submitted:");
  };
  return (
    <div className="signup">
      <h1>Sign Up</h1>
    <form method="post" onSubmit={handleSubmit}>
      <label>
        User Name:
        <input
          placeholder="username"
          name="name"
          type="text"
        />
      </label>
      <br />
      <label>
        Email:
        <input
          placeholder="email"
          type="email"
          name="email"
        />
      </label>
      <br />
      <label>
        Password:
        <input
          placeholder="password"
          type="password"
          name="password"
        />
      </label>
        Role:
        <label><input type="radio" className="radioButton" name="myRadio" value="patient" />Patient</label>
        <label><input type="radio" className="radioButton" name="myRadio" value="doctor" /> Doctor</label>
        <br />
        <button type="submit" disabled={loading}>
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>
        <br></br>
        <br></br>
        <p>Already have an account? <Link to="/signin">Sign in</Link></p>
      </form>
    </div>
  );
};

export default SignUp;
