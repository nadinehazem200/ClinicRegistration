import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    // <nav>
    //   <ul className="d-flex list">
    //     <li>
    //       <Link to="/">Home</Link>
    //     </li>
    //     <li>
    //       <Link to="/signup">Sign Up</Link>
    //     </li>
    //     <li>
    //       <Link to="/signin">Sign In</Link>
    //     </li>
    //     <li>
    //       <Link to="/doctorschedule">Doctor Schedule</Link>
    //     </li>
    //     <li>
    //       <Link to="/clinicreservation">Clinic Reservation</Link>
    //     </li>
    //   </ul>
    // </nav>
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light d-flex justify-content-between  p-3">
        <a className="navbar-brand" href="#">
          Navbar
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse " id="navbarSupportedContent">
          <ul className="navbar-nav  list-unstyled">
            <li>
              <Link className="nav-link active text-black " to="/signup">
                Sign Up
              </Link>
            </li>
            <li>
              <Link className="nav-link active text-black " to="/signin">
                Sign In
              </Link>
            </li>
            <li>
              <Link
                className="nav-link active text-black "
                to="/doctorschedule"
              >
                Doctor Schedule
              </Link>
            </li>
            <li>
              <Link
                className="nav-link active text-black "
                to="/clinicreservation"
              >
                Clinic Reservation
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}
export default Navbar;
