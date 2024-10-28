import React from "react"
import {useNavigate} from "react-router-dom"
import axios from "axios"
import {motion} from "framer-motion"

const url = "http://localhost:5000/send-email";

export default function ConfirmPage(props) {

  const email = props.email
  let features = props.features
  const navigate = useNavigate()

  const handleSubmit = event => {
    event.preventDefault()
    //const data = JSON.stringify(props.features); // Convert to JSON format
    for (let key in features) {
      if (typeof features[key] === "string") {
        features[key] = parseFloat(features[key]);
      }
    }
    const data = Object.assign({}, email, features);

    axios
      .post(url, data)
      .then(res => {
        console.log(res)
      })
      .catch(error => {
        console.log(error)
      })
  }

  return(
    <motion.div
    className="confirmPage"
    initial = {{opacity: 0, transition: {duration: 0.25}}}
    animate = {{opacity: 1, transition: {duration: 0.25}}}
    exit = {{opacity: 0, transition: {duration: 0.25}}}>
    <p className="confirmPage-text">The form is completed. Please click "Submit" to submit. ✅</p>
      <div className="button-container">
        <button className="back-button-confirm-page" onClick={() => {navigate("/cost")}}>Back</button>
        <button className="next-button-confirm-page" onClick={(e) => {navigate("/endPage");handleSubmit(e)}}>Submit</button>  
      </div>
    </motion.div>
  )
}