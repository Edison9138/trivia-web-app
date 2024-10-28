import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function RuralCity(props) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, transition: { duration: 0.25 } }}
      animate={{ opacity: 1, transition: { duration: 0.25 } }}
      exit={{ opacity: 0, transition: { duration: 0.25 } }}
    >
      <form className="ruralCity">
        <p className="ruralCity-text">
          Q7: I prefer my school to be in an area that is rural / urban
        </p>
        <div className="ruralCity-radio">
          {[...Array(10)].map((_, index) => (
            <div key={index}>
              <div>{index + 1}</div>
              <input
                type="radio"
                id={index + 1}
                name="ruralCity"
                value={index + 1}
                onChange={props.handle_change}
              />
            </div>
          ))}
        </div>
        <div className="radio-text">
          <div>Rural 🏕️</div>
          <div>Urban 🏙️</div>
        </div>
      </form>
      <div className="button-container">
        <button
          className="back-button"
          onClick={() => {
            navigate("/party");
          }}
        >
          Back
        </button>
        <button
          className="next-button"
          onClick={() => {
            navigate("/alumNetwork");
          }}
        >
          Next
        </button>
      </div>
    </motion.div>
  );
}
