import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function AlumNetwork(props) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, transition: { duration: 0.25 } }}
      animate={{ opacity: 1, transition: { duration: 0.25 } }}
      exit={{ opacity: 0, transition: { duration: 0.25 } }}
    >
      <form className="alumNetwork">
        <p className="alumNetwork-text">
          Q8: I want my school to have a small / large Taiwanese alumni network
        </p>
        <div className="alumNetwork-radio">
          {[...Array(10)].map((_, index) => (
            <div key={index}>
              <div>{index + 1}</div>
              <input
                type="radio"
                id={index + 1}
                name="alumNetwork"
                value={index + 1}
                onChange={props.handle_change}
              />
            </div>
          ))}
        </div>
        <div className="radio-text">
          <div>Small 🙎‍♂️</div>
          <div>Large 👨‍👩‍👧‍👦</div>
        </div>
      </form>
      <div className="button-container">
        <button
          className="back-button"
          onClick={() => {
            navigate("/ruralCity");
          }}
        >
          Back
        </button>
        <button
          className="next-button"
          onClick={() => {
            navigate("/intlStudent");
          }}
        >
          Next
        </button>
      </div>
    </motion.div>
  );
}
