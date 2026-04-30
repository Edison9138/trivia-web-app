import React from 'react'
import {Routes, Route, useLocation} from "react-router-dom"
import HomePage from "./HomePage"
import Question from "./Question"
import EndPage from "./EndPage"
import ErrorPage from "./ErrorPage"
import FilterQuestions from './FilterQuestions'
import {AnimatePresence} from "framer-motion"

export default function AnimatedRoutes({ questionsData, updateQuestions }) {

  const location = useLocation()

  return (
    <AnimatePresence mode = "wait">
      <Routes location = {location} key = {location.pathname}>
        <Route path = "/" element = {<HomePage />} />
        <Route path = "/filterQuestions" element = {<FilterQuestions updateQuestions={updateQuestions}/>} />
        <Route path = "/question" element = {<Question questionsData={questionsData}/>} />
        <Route path = "/endPage" element = {<EndPage/>} />
        <Route path = "*" element = {<ErrorPage/>}/>
      </Routes>
    </AnimatePresence>
  )
}
