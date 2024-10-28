import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function LecSize(props) {
  const navigate = useNavigate();
  const lecSizeOptions = [
    { id: "10", value: "10", label: "Above 400 students" },
    { id: "8.2", value: "8.2", label: "200~400 students" },
    { id: "6.4", value: "6.4", label: "100~200 students" },
    { id: "4.6", value: "4.6", label: "50~100 students" },
    { id: "2.8", value: "2.8", label: "25~50 students" },
    { id: "1", value: "1", label: "Less than 25 students" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, transition: { duration: 0.25 } }}
      animate={{ opacity: 1, transition: { duration: 0.25 } }}
      exit={{ opacity: 0, transition: { duration: 0.25 } }}
    >
      <form className="lecSize">
        <p className="lecSize-text">
          Q10: I prefer the average lecture size in my school to be... 👩‍🏫
        </p>
        <div className="lecSize-radio">
          {lecSizeOptions.map((option) => (
            <div key={option.id}>
              <input
                type="radio"
                id={option.id}
                name="lecSize"
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
            navigate("/intlStudent");
          }}
        >
          Back
        </button>
        <button
          className="next-button"
          onClick={() => {
            navigate("/enrollment");
          }}
        >
          Next
        </button>
      </div>
    </motion.div>
  );
}
