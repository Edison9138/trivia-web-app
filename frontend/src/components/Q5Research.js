import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Research(props) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, transition: { duration: 0.25 } }}
      animate={{ opacity: 1, transition: { duration: 0.25 } }}
      exit={{ opacity: 0, transition: { duration: 0.25 } }}
    >
      <form className="research">
        <p className="research-text">
          Q5: I want to pursue research experiences on campus <br /> as an
          international student
        </p>
        <div className="research-radio">
          {[...Array(10)].map((_, index) => (
            <div key={index}>
              <div>{index + 1}</div>
              <input
                type="radio"
                id={index + 1}
                name="research"
                value={index + 1}
                onChange={props.handle_change}
              />
            </div>
          ))}
        </div>
        <div className="radio-text">
          <div>No 🙅‍♂️</div>
          <div>Yes 🙆‍♂️</div>
        </div>
      </form>
      <div className="button-container">
        <button
          className="back-button"
          onClick={() => {
            navigate("/curriculum");
          }}
        >
          Back
        </button>
        <button
          className="next-button"
          onClick={() => {
            navigate("/party");
          }}
        >
          Next
        </button>
      </div>
    </motion.div>
  );
}
