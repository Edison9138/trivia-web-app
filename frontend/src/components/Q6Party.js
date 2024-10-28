import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Party(props) {
  const navigate = useNavigate();
  const partyOptions = [
    {
      id: "1",
      value: "1",
      label: "Greek Life is all my college life (3 times a week)",
    },
    {
      id: "3.25",
      value: "3.25",
      label: "We party a lot in frats (1 time a week)",
    },
    {
      id: "5.5",
      value: "5.5",
      label: "Party once in a while (1 every other week)",
    },
    {
      id: "7.75",
      value: "7.75",
      label: "Not a fan of partying but will tolerate (Once a semester)",
    },
    {
      id: "10",
      value: "10",
      label: "Party? What's that? (Once in my entire college life or None)",
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
          Q6: I want the party scene at my school to be... 🥳
        </p>
        <div className="party-radio">
          {partyOptions.map((option) => (
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
            navigate("/research");
          }}
        >
          Back
        </button>
        <button
          className="next-button"
          onClick={() => {
            navigate("/ruralCity");
          }}
        >
          Next
        </button>
      </div>
    </motion.div>
  );
}
