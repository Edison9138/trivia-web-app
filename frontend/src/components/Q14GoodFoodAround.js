import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function GoodFoodAround(props) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, transition: { duration: 0.25 } }}
      animate={{ opacity: 1, transition: { duration: 0.25 } }}
      exit={{ opacity: 0, transition: { duration: 0.25 } }}
    >
      <form className="goodFoodAround">
        <p className="goodFoodAround-text">
          Q14: I want to eat regularly off-campus
        </p>
        <div className="goodFoodAround-radio">
          {[...Array(10)].map((_, index) => (
            <div key={index}>
              <div>{index + 1}</div>
              <input
                type="radio"
                id={index + 1}
                name="goodFoodAround"
                value={index + 1}
                onChange={props.handle_change}
              />
            </div>
          ))}
        </div>
        <div className="radio-text">
          <div>No 🙄</div>
          <div>Yes 🤤</div>
        </div>
      </form>
      <div className="button-container">
        <button
          className="back-button"
          onClick={() => {
            navigate("/spirit");
          }}
        >
          Back
        </button>
        <button
          className="next-button"
          onClick={() => {
            navigate("/diningHall");
          }}
        >
          Next
        </button>
      </div>
    </motion.div>
  );
}
