import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Footer(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    // Update windowWidth state when the window is resized
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="footer">
    <nav className="bottom-bar-no-questions">
      <div className="logo-container">
          <a
            className="website-logo-link"
            href="https://edison910308.wixsite.com/eliao"
            target="_blank"
            rel="noreferrer"
          >
            <img
              className="website-logo"
              src={require("../images/website-logo.png")}
              alt=""
            />
          </a>
          <a
            className="linkedin-logo-link"
            href="https://www.linkedin.com/in/wliao75"
            target="_blank"
            rel="noreferrer"
          >
            <img
              className="linkedin-logo"
              src={require("../images/linkedin-logo.png")}
              alt=""
            />
          </a>
        </div>
    </nav>
  </div>
  )
}