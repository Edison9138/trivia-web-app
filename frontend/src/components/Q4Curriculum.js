import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Curriculum(props) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, transition: { duration: 0.25 } }}
      animate={{ opacity: 1, transition: { duration: 0.25 } }}
      exit={{ opacity: 0, transition: { duration: 0.25 } }}
    >
      <form className="curriculum">
        <p className="curriculum-text">
          Q4: I prefer loose curriculum / core curriculum
        </p>
        <div className="curriculum-radio">
          {[...Array(10)].map((_, index) => (
            <div key={index}>
              <div>{index + 1}</div>
              <input
                type="radio"
                id={index + 1}
                name="curriculum"
                value={index + 1}
                onChange={props.handle_change}
              />
            </div>
          ))}
        </div>
        <div className="radio-text">
          <div>Loose 🔀</div>
          <div>Core ➡️</div>
        </div>
      </form>
      <div className="button-container">
        <button
          className="back-button"
          onClick={() => {
            navigate("/flexMajor");
          }}
        >
          Back
        </button>
        <button
          className="next-button"
          onClick={() => {
            navigate("/research");
          }}
        >
          Next
        </button>
      </div>
    </motion.div>
  );
}
