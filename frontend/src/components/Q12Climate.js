import React from "react"
import {useNavigate} from "react-router-dom"
import {motion} from "framer-motion"

export default function Climate(props) {

  const navigate = useNavigate()

  return(
    <motion.div
    initial = {{opacity: 0, transition: {duration: 0.25}}}
    animate = {{opacity: 1, transition: {duration: 0.25}}}
    exit = {{opacity: 0, transition: {duration: 0.25}}}>
      <form className="climate">
        <p className="climate-text">Q12: I prefer the climate to be... 🌡️</p>
        <div className="climate-radio">
          <div>
            <input type="radio" id="10" name="climate" value="10" onChange={props.handle_change} 
            />
            <label htmlFor="part-time">Four seasons</label>
          </div>
          <div>
            <input type="radio" id="1" name="climate" value="1" onChange={props.handle_change} 
            />
            <label htmlFor="part-time">One season (YES we mean California)</label>
          </div>
        </div>
      </form>
      <div className="button-container">
        <button className="back-button" onClick={() => {navigate("/enrollment")}}>Back</button>
        <button className="next-button" onClick={() => {navigate("/spirit")}}>Next</button>  
      </div>
    </motion.div>
  )
}