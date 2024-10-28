import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function GoodArts(props) {
  const navigate = useNavigate();

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, transition: { duration: 0.25 } }}
        animate={{ opacity: 1, transition: { duration: 0.25 } }}
        exit={{ opacity: 0, transition: { duration: 0.25 } }}
      >
        <form className="goodArts">
          <p className="goodArts-text">
            Q1: I prefer a school with strong arts programs
          </p>
          <div className="goodArts-radio">
            {[...Array(10)].map((_, index) => (
              <div key={index}>
                <div>{index + 1}</div>
                <input
                  type="radio"
                  id={index + 1}
                  name="good_arts"
                  value={index + 1}
                  onChange={props.handle_change}
                />
              </div>
            ))}
          </div>
          <div className="radio-text">
            <div>Weak 🤦‍♂️</div>
            <div>Strong 💪</div>
          </div>
        </form>
        <div className="button-container">
          {/* <button className="back-button" onClick={() => {navigate("/")}}>Back</button> */}
          <button
            className="next-button"
            onClick={() => {
              navigate("/goodSTEM");
            }}
          >
            Next
          </button>
        </div>
      </motion.div>
    </div>
  );
}
