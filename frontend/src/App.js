import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AnimatedRoutes from "./components/AnimatedRoutes";
import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";

function App() {

  const [email, setEmail] = useState("")

  const [features, setFeatures] = useState({
    good_arts: null,
    goodSTEM: null,
    flexMajor: null,
    curriculum: null,
    research: null,
    party: null,
    ruralCity: null,
    alumNetwork: null,
    intlStudent: null,
    lecSize: null,
    enrollment: null,
    climate: null,
    spirit: null,
    goodFoodAround: null,
    diningHall: null,
    cost: null,
  });

  const handleEmailChange = (email) => {
    setEmail(() => {
      return {
        email
      };
    });
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setFeatures((prevFeatures) => {
      return {
        ...prevFeatures,
        [name] : value,
      };
    });
  }

  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main">
          <AnimatedRoutes handle_change={handleChange} features={features} handleEmailChange = {handleEmailChange} email = {email}/>
        </main>
        <Footer features={features} />
      </div>
    </Router>
  );
}

export default App;
