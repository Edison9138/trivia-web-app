import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Cost(props) {
  const navigate = useNavigate();
  const costOptions = [
    { id: "10", value: "10", label: "Above 80K" },
    { id: "8.2", value: "8.2", label: "65 ~ 80k" },
    { id: "6.4", value: "6.4", label: "50 ~ 65k" },
    { id: "4.6", value: "4.6", label: "35 ~ 50K" },
    { id: "2.8", value: "2.8", label: "20 ~ 35K" },
    { id: "1", value: "1", label: "Below 20K" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, transition: { duration: 0.25 } }}
      animate={{ opacity: 1, transition: { duration: 0.25 } }}
      exit={{ opacity: 0, transition: { duration: 0.25 } }}
    >
      <form className="cost">
        <p className="cost-text">
          Q16: I can afford overall cost (in USD) WITHOUT any aid in this range
          💸
        </p>
        <div className="cost-radio">
          {costOptions.map((option) => (
            <div key={option.id}>
              <input
                type="radio"
                id={option.id}
                name="cost"
                value={option.value}
                onChange={props.handle_change}
              />
              <label htmlFor={option.id}>{option.label}</label>
            </div>
          ))}
        </div>
      </form>
      <div className="button-container">
        <button
          className="back-button"
          onClick={() => {
            navigate("/diningHall");
          }}
        >
          Back
        </button>
        <button
          className="next-button"
          onClick={() => {
            navigate("/confirmPage");
          }}
        >
          Next
        </button>
      </div>
    </motion.div>
  );
}
