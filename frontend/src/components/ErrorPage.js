import React from 'react'
import {motion} from "framer-motion"

export default function ErrorPage() {
  return (
    <motion.div
      initial = {{opacity: 0, transition: {duration: 0.25}}}
      animate = {{opacity: 1, transition: {duration: 0.25}}}
      exit = {{opacity: 0, transition: {duration: 0.25}}}>ERROR! PAGE NOT FOUND!
    </motion.div>
  )
}
