import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function HomePage(props) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("")

  const handleSubmit = (event) => {
    event.preventDefault();
    props.handleEmailChange(email)
  };
  
  function handleEmailInput (e) {
    setEmail(() => {
      return e.target.value
    })
  }

  return (
    <motion.div
      className="HomePage"
      initial={{ opacity: 0, transition: { duration: 0.25 } }}
      animate={{ opacity: 1, transition: { duration: 0.25 } }}
      exit={{ opacity: 0, transition: { duration: 0.25 } }}
    >
      <div className="info-email-container">
        <div className="info">
          <p className="info-header">🏫 Beyond Taiwan College Matching App</p>
          <p className="info-text">
            Beyond Taiwan is dedicated to helping you find the best education.
            Using the information from the form, we will list some schools that
            fit you the best. <br />
            Unlike simple matching with just GPA and standardized testing
            scores, this matching program incorporates opinions regarding
            several school features from our large pool of alumni and students
            from numerous institutions. <br />
            <br />
            We hope this form (with 16 questions) brings you another way of
            researching your college list! 😉
          </p>
        </div>
        <form className="email" onSubmit={handleSubmit}>
          <div className="email-form">
            <input
              type="email"
              placeholder="Enter your email for results"
              className="email-input"
              onChange={handleEmailInput}
              name="email"
              value = {email}
            />
            <button
              className="start-button"
              type="submit"
              onClick={() => {
                navigate("/goodArts");
              }}
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

export default HomePage;
