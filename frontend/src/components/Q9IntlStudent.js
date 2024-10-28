import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function IntlStudents(props) {
  const navigate = useNavigate();
  const intlStudentOptions = [
    { id: "10", value: "10", label: "Above 50%" },
    { id: "8.2", value: "8.2", label: "40~50%" },
    { id: "6.4", value: "6.4", label: "30~40%" },
    { id: "4.6", value: "4.6", label: "20~30%" },
    { id: "2.8", value: "2.8", label: "10~20%" },
    { id: "1", value: "1", label: "Less than 10%" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, transition: { duration: 0.25 } }}
      animate={{ opacity: 1, transition: { duration: 0.25 } }}
      exit={{ opacity: 0, transition: { duration: 0.25 } }}
    >
      <form className="intlStudent">
        <p className="intlStudent-text">
          Q9: I prefer the ratio of international students to be... 🌏
        </p>
        <div className="intlStudent-radio">
          {intlStudentOptions.map((option) => (
            <div key={option.id}>
              <input
                type="radio"
                id={option.id}
                name="intlStudent"
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
            navigate("/alumNetwork");
          }}
        >
          Back
        </button>
        <button
          className="next-button"
          onClick={() => {
            navigate("/lecSize");
          }}
        >
          Next
        </button>
      </div>
    </motion.div>
  );
}
