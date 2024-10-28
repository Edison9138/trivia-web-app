import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function GoodSTEM(props) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, transition: { duration: 0.25 } }}
      animate={{ opacity: 1, transition: { duration: 0.25 } }}
      exit={{ opacity: 0, transition: { duration: 0.25 } }}
    >
      <form className="goodSTEM">
        <p className="goodSTEM-text">
          Q2: I prefer a school with strong STEM programs
        </p>
        <div className="goodSTEM-radio">
          {[...Array(10)].map((_, index) => (
            <div key={index}>
              <div>{index + 1}</div>
              <input
                type="radio"
                id={index + 1}
                name="goodSTEM"
                value={index + 1}
                onChange={props.handle_change}
              />
            </div>
          ))}
        </div>
        <div className="radio-text">
          <div>Weak 🤦‍♀️</div>
          <div>Strong 💪🏽</div>
        </div>
      </form>
      <div className="button-container">
        <button
          className="back-button"
          onClick={() => {
            navigate("/goodArts");
          }}
        >
          Back
        </button>
        <button
          className="next-button"
          onClick={() => {
            navigate("/flexMajor");
          }}
        >
          Next
        </button>
      </div>
    </motion.div>
  );
}
