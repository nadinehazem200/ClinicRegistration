import React, { useState } from "react";
import "../SignUp/SignUp.css";
const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    // You can use the form data (name, email, phoneNumber) to make an API call or perform any required validations
    console.log("Form submitted:", name, email, phoneNumber);
    setName("");
    setEmail("");
    setPhoneNumber("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input
          className="form-control"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <br />
      <label>
        Email:
        <input
          className="form-control"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <br />
      <label>
        Phone Number:
        <input
          className="form-control"
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </label>
      <br />
      <button className="btn mt-3 btn-outline-danger" type="submit">
        Sign Up
      </button>
    </form>
  );
};

export default SignUp;
