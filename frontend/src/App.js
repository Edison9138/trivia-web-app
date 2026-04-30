import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AnimatedRoutes from "./components/AnimatedRoutes";
import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";

function App() {
  const [questionsData, setQuestionsData] = useState({
    questions: [],
    answers: [],
    question_ids: [],
  });

  const updateQuestions = (data) => {
    setQuestionsData(data);
  };

  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main">
          <AnimatedRoutes
            questionsData={questionsData}
            updateQuestions={updateQuestions}
          />
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
