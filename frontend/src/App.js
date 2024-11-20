import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AnimatedRoutes from "./components/AnimatedRoutes";
import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
// import { GoogleLogin } from '@react-oauth/google';

function App() {

  const responseMessage = (response) => {
    console.log(response);
  };
  const errorMessage = (error) => {
      console.log(error);
  };

  const [questionsData, setQuestionsData] = useState({
    questions: [],
    correct_answers: [],
    answers: [],
    question_ids: [],
  });

  const updateQuestions = (data) => {
    setQuestionsData(data);
  };

  return (
    <Router>
      <div className="app">
        {/* <GoogleLogin onSuccess={responseMessage} onError={errorMessage} /> */}
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
