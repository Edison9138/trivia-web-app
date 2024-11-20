import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function HomePage(props) {
  const navigate = useNavigate();

  return (
    <motion.div
      className="HomePage"
      initial={{ opacity: 0, transition: { duration: 0.25 } }}
      animate={{ opacity: 1, transition: { duration: 0.25 } }}
      exit={{ opacity: 0, transition: { duration: 0.25 } }}
    >
      <div className="info-email-container">
        <div className="info">
          <h1 className="info-header">🎪 Trivia Game 🎪</h1>
          <div className="info-text">
            <p>
              Welcome to the Trivia Game! Featuring 4,148 questions sourced from the{" "}
              <a href="https://opentdb.com/" target="_blank" rel="noopener noreferrer">
                Open Trivia DB
              </a>
              , this game allows you to customize your experience by filtering questions based on
              categories, difficulty levels, and question types.
            </p>
            <p>
              Choose the number of questions you'd like to play, test your knowledge, and receive a
              score at the end. Have fun and challenge yourself!
            </p>
          </div>
        </div>
        <form className="email">
          <div className="email-form">
            <button
              className="start-button"
              type="button"
              onClick={() => {
                navigate("/filterQuestions");
              }}
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

export default HomePage;
