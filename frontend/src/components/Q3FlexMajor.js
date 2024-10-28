import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function FlexMajor(props) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, transition: { duration: 0.25 } }}
      animate={{ opacity: 1, transition: { duration: 0.25 } }}
      exit={{ opacity: 0, transition: { duration: 0.25 } }}
    >
      <form className="flexMajor">
        <p className="flexMajor-text">
          Q3: I want a school that provides ease on choosing / switching majors
        </p>
        <div className="flexMajor-radio">
          {[...Array(10)].map((_, index) => (
            <div key={index}>
              <div>{index + 1}</div>
              <input
                type="radio"
                id={index + 1}
                name="flexMajor"
                value={index + 1}
                onChange={props.handle_change}
              />
            </div>
          ))}
        </div>
        <div className="radio-text">
          <div>Easy ✅</div>
          <div>Hard 🚫</div>
        </div>
      </form>
      <div className="button-container">
        <button
          className="back-button"
          onClick={() => {
            navigate("/goodSTEM");
          }}
        >
          Back
        </button>
        <button
          className="next-button"
          onClick={() => {
            navigate("/curriculum");
          }}
        >
          Next
        </button>
      </div>
    </motion.div>
  );
}
