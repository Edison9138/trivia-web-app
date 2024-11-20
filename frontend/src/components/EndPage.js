import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export default function EndPage(props) {
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve the score from location state or localStorage
  const [score, setScore] = useState(() => {
    return location.state?.score || localStorage.getItem('userScore') || 0;
  });

  useEffect(() => {
    if (score === 0) {
      // If no score is available, redirect to home page
      navigate("/");
    }
  }, [score, navigate]);

  return (
    <motion.div
      className="endPage"
      initial={{ opacity: 0, transition: { duration: 0.25 } }}
      animate={{ opacity: 1, transition: { duration: 0.25 } }}
      exit={{ opacity: 0, transition: { duration: 0.25 } }}
    >
      <h2 className="endPage-text"></h2>
      <p className="endPage-text">Completed!<br/> <br/>Your score: {score}%</p>
      <div className="button-container">
        <button
          className="button-endpage"
          onClick={() => {
            navigate("/");
          }}
        >
          Back to HomePage
        </button>
      </div>
    </motion.div>
  );
}