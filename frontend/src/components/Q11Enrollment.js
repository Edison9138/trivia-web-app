import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Enrollment(props) {
  const navigate = useNavigate();
  const enrollmentOptions = [
    { id: "10", value: "10", label: "More than 20,000 students" },
    { id: "7", value: "7", label: "between 10,000 and 15,000 students" },
    { id: "4", value: "4", label: "Between 5,000 and 10,000 students" },
    { id: "1", value: "1", label: "Less than 5,000 students" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, transition: { duration: 0.25 } }}
      animate={{ opacity: 1, transition: { duration: 0.25 } }}
      exit={{ opacity: 0, transition: { duration: 0.25 } }}
    >
      <form className="enrollment">
        <p className="enrollment-text">
          Q11: I prefer an undergraduate student body size of... 👨🏼‍🎓
        </p>
        <div className="enrollment-radio">
          {enrollmentOptions.map((option) => (
            <div key={option.id}>
              <input
                type="radio"
                id={option.id}
                name="enrollment"
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
            navigate("/lecSize");
          }}
        >
          Back
        </button>
        <button
          className="next-button"
          onClick={() => {
            navigate("/climate");
          }}
        >
          Next
        </button>
      </div>
    </motion.div>
  );
}
