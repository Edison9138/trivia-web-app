import React from "react"

export default function Header() {
  return(
    <header className="header">
      <a className="bt-logo-link" href = "https://beyondtw.wordpress.com/" target="_blank" rel="noreferrer">
        <img src={require("../images/bt-logo.png")} className="bt-logo" alt = ""/>
      </a>
    </header>
  )
}