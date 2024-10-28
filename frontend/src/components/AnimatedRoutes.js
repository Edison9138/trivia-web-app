import React from 'react'
import {Routes, Route, useLocation} from "react-router-dom"
import HomePage from "./HomePage"
import Q1GoodArts from "./Q1GoodArts"
import Q2GoodSTEM from "./Q2GoodSTEM"
import Q3FlexMajor from "./Q3FlexMajor"
import Q4Curriculum from "./Q4Curriculum"
import Q5Research from "./Q5Research"
import Q6Party from "./Q6Party"
import Q7RuralCity from "./Q7RuralCity" 
import Q8AlumNetwork from "./Q8AlumNetwork"
import Q9IntlStudent from "./Q9IntlStudent"
import Q10LecSize from "./Q10LecSize"
import Q11Enrollment from "./Q11Enrollment"
import Q12Climate from "./Q12Climate"
import Q13Spirit from "./Q13Spirit"
import Q14GoodFoodAround from "./Q14GoodFoodAround"
import Q15DiningHall from "./Q15DiningHall"
import Q16Cost from "./Q16Cost"
import ConfirmPage from './ConfirmPage'
import EndPage from "./EndPage"
import ErrorPage from "./ErrorPage"
import Footer from './Footer'
import {AnimatePresence} from "framer-motion"

export default function AnimatedRoutes(props) {

  const location = useLocation()

  return (
    <AnimatePresence mode = "wait">
      <Routes location = {location} key = {location.pathname}>
        <Route path = "/" element = {<HomePage handle_change = {props.handle_change} handleEmailChange = {props.handleEmailChange} />} />
        <Route path = "/questions" element = {<Footer />}/>
          <Route path = "/goodArts" element = {<Q1GoodArts handle_change = {props.handle_change} features = {props.features}/>} />
          <Route path = "/goodSTEM" element = {<Q2GoodSTEM handle_change = {props.handle_change} features = {props.features}/>} />
          <Route path = "/flexMajor" element = {<Q3FlexMajor handle_change = {props.handle_change}/>} />
          <Route path = "/curriculum" element = {<Q4Curriculum handle_change = {props.handle_change}/>} />
          <Route path = "/research" element = {<Q5Research handle_change = {props.handle_change}/>} />
          <Route path = "/party" element = {<Q6Party handle_change = {props.handle_change}/>} />
          <Route path = "/ruralCity" element = {<Q7RuralCity handle_change = {props.handle_change}/>} />
          <Route path = "/alumNetwork" element = {<Q8AlumNetwork handle_change = {props.handle_change}/>} />
          <Route path = "/intlStudent" element = {<Q9IntlStudent handle_change = {props.handle_change}/>} />
          <Route path = "/lecSize" element = {<Q10LecSize handle_change = {props.handle_change}/>} />
          <Route path = "/enrollment" element = {<Q11Enrollment handle_change = {props.handle_change}/>} />
          <Route path = "/climate" element = {<Q12Climate handle_change = {props.handle_change}/>} />
          <Route path = "/spirit" element = {<Q13Spirit handle_change = {props.handle_change}/>} />
          <Route path = "/goodFoodAround" element = {<Q14GoodFoodAround handle_change = {props.handle_change}/>} />
          <Route path = "/diningHall" element = {<Q15DiningHall handle_change = {props.handle_change}/>} />
          <Route path = "/cost" element = {<Q16Cost handle_change = {props.handle_change}/>} />
          <Route path = "/confirmPage" element = {<ConfirmPage handle_change = {props.handle_change} features = {props.features} email = {props.email}/>} />
        <Route path = "/endPage" element = {<EndPage handle_change = {props.handle_change}/>} />
        <Route path = "*" element = {<ErrorPage/>}/>
      </Routes>
    </AnimatePresence>
  )
}
