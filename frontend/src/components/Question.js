import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const Question = ({ questionsData }) => {
  const navigate = useNavigate();

  // State to track the current question index
  const [currentIndex, setCurrentIndex] = useState(0);

  // State to track the user's selected answers
  const [userAnswers, setUserAnswers] = useState({});

  // Destructure the questions and answers from questionsData
  const { questions, answers } = questionsData;

  // Ensure questions and answers are defined
  if (!questions || !answers || questions.length === 0) {
    return <p>Loading questions...</p>;
  }

  // Handle submission of answers
  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:5001/calculate-score", {
        user_answers: Object.values(userAnswers),
        correct_answers: questionsData.correct_answers,
      });

      const data = response.data;

      if (data.status === "success") {
        // Navigate to the end page with the score
        navigate("/endPage", { state: { score: data.data.user_score } });
      } else {
        console.error("Failed to calculate score:", data.data);
        // Handle error (optional)
      }
    } catch (error) {
      console.error("Error calculating score:", error);
      // Handle error (optional)
    }
  };

  // Handle navigation to the next question
  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Handle navigation to the previous question
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Handle answer selection
  const handleAnswerChange = (event) => {
    const selectedAnswer = event.target.value;
    setUserAnswers({
      ...userAnswers,
      [currentIndex]: selectedAnswer,
    });
  };

  // Calculate the progress percentage
  const progressPercentage = ((currentIndex + 1) / questions.length) * 100;

  // Get the options for the current question
  const options = answers[currentIndex];
  if (!options) {
    return <p>Loading options...</p>;
  }

  // Shuffle options if desired
  // const shuffledOptions = [...options].sort(() => Math.random() - 0.5);

  return (
    <div className="pageContainer">
    <motion.div
      className="questionPage"  // Added className here
      initial={{ opacity: 0, transition: { duration: 0.25 } }}
      animate={{ opacity: 1, transition: { duration: 0.25 } }}
      exit={{ opacity: 0, transition: { duration: 0.25 } }}
    >

        <h2>Question {currentIndex + 1}</h2>

      <AnimatePresence mode='wait'>
      <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            style={{ width: '100%' }}
          >
      <div style={{ width: '100%' }}>
        <p>{questions[currentIndex]}</p>

        {/* Render the answer options as radio buttons */}
        <div className="options-container">
          {options.map((option, index) => (
            <div className="option" key={index}>
              <input
                type="radio"
                id={`question-${currentIndex}-option-${index}`}
                name={`question-${currentIndex}`}
                value={option}
                checked={userAnswers[currentIndex] === option}
                onChange={handleAnswerChange}
              />
              <label htmlFor={`question-${currentIndex}-option-${index}`}>{option}</label>
            </div>
          ))}
        </div>
      </div>
      </motion.div>
      </AnimatePresence>
      {/* Navigation buttons */}
      <div className="button-container">
        <button
          className="back-button"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          Back
        </button>

        {currentIndex < questions.length - 1 ? (
          <button
            className="next-button"
            onClick={handleNext}
            disabled={!userAnswers[currentIndex]} // Disable if no answer selected
          >
            Next
          </button>
        ) : (
          <button
            className="submit-button"
            onClick={handleSubmit}
            disabled={!userAnswers[currentIndex]} // Disable if no answer selected
          >
            Submit
          </button>
        )}
      </div>

      <div className="progress-container">
        <div
          className="progress-bar"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </motion.div>
    </div>
  );
};

export default Question;