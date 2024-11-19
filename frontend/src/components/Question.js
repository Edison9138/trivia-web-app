import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Party(props) {
  const navigate = useNavigate();
  const questionOptions = [
    {
      id: "1",
      value: "1",
      label: "Q1",
    },
    {
      id: "3.25",
      value: "3.25",
      label: "Q2",
    },
    {
      id: "5.5",
      value: "5.5",
      label: "Q3",
    },
    {
      id: "7.75",
      value: "7.75",
      label: "Q4",
    },
    {
      id: "10",
      value: "10",
      label: "Q5",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, transition: { duration: 0.25 } }}
      animate={{ opacity: 1, transition: { duration: 0.25 } }}
      exit={{ opacity: 0, transition: { duration: 0.25 } }}
    >
      <form className="party">
        <p className="party-text">
          Q1: Trivia question...
        </p>
        <div className="party-radio">
          {questionOptions.map((option) => (
            <div key={option.id}>
              <input
                type="radio"
                id={option.id}
                name="party"
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
            navigate("/filterQuestions");
          }}
        >
          Back
        </button>
        <button
          className="next-button"
          onClick={() => {
            navigate("/endPage");
          }}
        >
          Next
        </button>
      </div>
    </motion.div>
  );
}
