import React from "react"
import {useNavigate} from "react-router-dom"
import {motion} from "framer-motion"

export default function EndPage(props) {

  const navigate = useNavigate()

  return(
    <motion.div
    className="endPage"
    initial = {{opacity: 0, transition: {duration: 0.25}}}
    animate = {{opacity: 1, transition: {duration: 0.25}}}
    exit = {{opacity: 0, transition: {duration: 0.25}}}>
    <p className="endPage-text">The form is submitted, and the results will be sent to your email!<br/>
    <br/>Thanks for using our College Matching App 🥰</p>
      <div className="button-container">
        <button className="button-endpage" onClick={() => {navigate("/")}}>Back to HomePage</button>
      </div>
    </motion.div>
  )
}