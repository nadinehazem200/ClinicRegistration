import React, { useState } from "react";
import "../SignUp/SignUp.css";
const SignIn = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can use the form data (name, email, phoneNumber) to make an API call or perform any required validations
    console.log("Form submitted:", name, email);
    setName("");
    setEmail("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input
          type="text"
          className="form-control"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <br />
      <label>
        Email:
        <input
          type="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <br />
      <br />
      <button className="btn btn-outline-success" type="submit">
        Sign In
      </button>
    </form>
  );
};

export default SignIn;
