import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Spirit(props) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, transition: { duration: 0.25 } }}
      animate={{ opacity: 1, transition: { duration: 0.25 } }}
      exit={{ opacity: 0, transition: { duration: 0.25 } }}
    >
      <form className="spirit">
        <p className="spirit-text">
          Q13: I like a school with strong school spirit <br /> (eg: campus
          traditions/celebrations, school sports events, …)
        </p>
        <div className="spirit-radio">
          {[...Array(10)].map((_, index) => (
            <div key={index}>
              <div>{index + 1}</div>
              <input
                type="radio"
                id={index + 1}
                name="spirit"
                value={index + 1}
                onChange={props.handle_change}
              />
            </div>
          ))}
        </div>
        <div className="radio-text">
          <div>Weak 🗿</div>
          <div>Strong 🤩</div>
        </div>
      </form>
      <div className="button-container">
        <button
          className="back-button"
          onClick={() => {
            navigate("/climate");
          }}
        >
          Back
        </button>
        <button
          className="next-button"
          onClick={() => {
            navigate("/goodFoodAround");
          }}
        >
          Next
        </button>
      </div>
    </motion.div>
  );
}
