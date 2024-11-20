import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

export default function FilterQuestions({ updateQuestions }) {
  const navigate = useNavigate();

  const difficulties = ["Easy", "Medium", "Hard"];
  const questionTypes = ["True/False", "Multiple Choice"];
  const categories = [
    'Animals', 'Art', 'Celebrities', 'Entertainment: Board Games', 'Entertainment: Books', 
    'Entertainment: Cartoon & Animations', 'Entertainment: Comics', 'Entertainment: Film', 
    'Entertainment: Japanese Anime & Manga', 'Entertainment: Music', 'Entertainment: Musicals & Theatres', 
    'Entertainment: Television', 'Entertainment: Video Games', 'General Knowledge', 'Geography', 
    'History', 'Mythology', 'Politics', 'Science & Nature', 'Science: Computers', 
    'Science: Gadgets', 'Science: Mathematics', 'Sports', 'Vehicles'
  ];

  const [selectedDifficulties, setSelectedDifficulties] = useState(new Set());
  const [selectedTypes, setSelectedTypes] = useState(new Set());
  const [selectedCategory, setSelectedCategory] = useState("");
  const [questionCount, setQuestionCount] = useState(0);
  const [isFormValid, setIsFormValid] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");

  const handleCheckboxChange = (event, setFunction, currentSet) => {
    const { value, checked } = event.target; // value and checked are attributes of the input field
    const newSet = new Set(currentSet);
    if (checked) newSet.add(value);
    else newSet.delete(value);
    setFunction(newSet);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  // Check if all required fields are selected to enable the Next button
  useEffect(() => {
    const isCategorySelected = selectedCategory !== "";
    const isDifficultySelected = selectedDifficulties.size > 0;
    const isTypeSelected = selectedTypes.size > 0;
    const isQuestionCountValid = questionCount > 0;

    setIsFormValid(isCategorySelected && isDifficultySelected && isTypeSelected && isQuestionCountValid);
  }, [selectedCategory, selectedDifficulties, selectedTypes, questionCount]);

  const handleNextClick = async () => {
    // Convert sets to arrays for sending in the request body
    const selectedDifficultiesArray = Array.from(selectedDifficulties);
    const selectedTypesArray = Array.from(selectedTypes);
  
    try {
      // Send a POST request with a JSON payload
      const response = await axios.post("http://localhost:5001/get-questions", {
        question_types: selectedTypesArray,
        category: selectedCategory,
        difficulties: selectedDifficultiesArray,
        count: questionCount,
      });
      
      console.log(response);
      const data = response.data;
  
      if (data.status === "fail") {
        // Show warning message if not enough questions are available
        setWarningMessage(
          `Not enough questions available. Max questions: ${
            data.data.match(/\d+/)[0]
          }`
        );
      } else {
        // Clear warning message and navigate if enough questions are available
        setWarningMessage("");
        // Update questions in App.js
        updateQuestions(data.data);
        navigate("/question");
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      setWarningMessage("An error occurred while fetching questions.");
    }
  };
  
  return (
    <motion.div
      className="filterQuestionsPage"
      initial={{ opacity: 0, transition: { duration: 0.25 } }}
      animate={{ opacity: 1, transition: { duration: 0.25 } }}
      exit={{ opacity: 0, transition: { duration: 0.25 } }}
    >
      <form>
        <p className="filterQuestions-text">
          Please filter the questions for your game
        </p>
        <div className="filterQuestions-options">
          {/* Category Dropdown */}
          <div className="category-dropdown">
            <h4>Category</h4>
            <select name="category" onChange={handleCategoryChange} required>
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Options */}
          <div className="difficulty-options">
            <h4>Difficulty</h4>
            {difficulties.map((difficulty) => (
              <label key={difficulty}>
                <input
                  className="difficulty-option"
                  type="checkbox"
                  name="difficulty"
                  value={difficulty}
                  checked={selectedDifficulties.has(difficulty)}
                  onChange={(event) =>
                    handleCheckboxChange(
                      event,
                      setSelectedDifficulties,
                      selectedDifficulties
                    )
                  }
                />
                {difficulty}
              </label>
            ))}
          </div>

          {/* Question Type Options */}
          <div className="type-options">
            <h4>Question Type</h4>
            {questionTypes.map((type) => (
              <label key={type}>
                <input
                  className="type-option"
                  type="checkbox"
                  name="type"
                  value={type}
                  checked={selectedTypes.has(type)}
                  onChange={(event) =>
                    handleCheckboxChange(event, setSelectedTypes, selectedTypes)
                  }
                />
                {type}
              </label>
            ))}
          </div>

          {/* Question Count */}
          <div className="question-count">
            <h4>Number of Questions</h4>
            <input
              type="number"
              min="1"
              value={questionCount}
              onChange={(e) => setQuestionCount(e.target.value)}
            />
            {warningMessage && (
              <p style={{ color: "red" }}>{warningMessage}</p>
            )}
          </div>
        </div>
      </form>
      <div className="button-container">
        <button
          className="next-button"
          onClick={handleNextClick}
          disabled={!isFormValid}
        >
          Next
        </button>
      </div>
    </motion.div>
  );
}