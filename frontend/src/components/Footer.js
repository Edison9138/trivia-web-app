import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Footer(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const navPages = [
    { path: "/goodArts", label: "Arts" },
    { path: "/goodSTEM", label: "STEM" },
    { path: "/flexMajor", label: "Flexible Major" },
    { path: "/curriculum", label: "Curriculum" },
    { path: "/research", label: "Research" },
    { path: "/party", label: "Party" },
    { path: "/ruralCity", label: "Rural City" },
    { path: "/alumNetwork", label: "Alumni Network" },
    { path: "/intlStudent", label: "International Student" },
    { path: "/lecSize", label: "Lecture Size" },
    { path: "/enrollment", label: "Enrollment" },
    { path: "/climate", label: "Climate" },
    { path: "/spirit", label: "Spirit" },
    { path: "/goodFoodAround", label: "Food Around" },
    { path: "/diningHall", label: "Dining Hall" },
    { path: "/cost", label: "Cost" },
  ];

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

  if (
    location.pathname === "/" ||
    location.pathname === "/endPage" ||
    windowWidth < 1200
  ) {
    return (
      <div className="footer">
        <nav className="bottom-bar-no-questions">
          <div className="logo-container">
            <a
              className="ig-logo-link"
              href="https://www.instagram.com/beyondtaiwan"
              target="_blank"
              rel="noreferrer"
            >
              <img
                className="ig-logo"
                src={require("../images/ig-logo.png")}
                alt=""
              />
            </a>
            <a
              className="fb-logo-link"
              href="https://www.facebook.com/beyondtaiwan2020/"
              target="_blank"
              rel="noreferrer"
            >
              <img
                className="fb-logo"
                src={require("../images/fb-logo.png")}
                alt=""
              />
            </a>
            <a
              className="linkedin-logo-link"
              href="https://www.linkedin.com/company/beyond-taiwan"
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
    );
  } else {
    return (
      <div className="footer">
        <nav className="nav-pages">
          {navPages.map((page, index) => (
            <p key={index} onClick={() => navigate(page.path)}>
              {page.label}
            </p>
          ))}
        </nav>
        <nav className="bottom-bar-questions">
          <div className="logo-container">
            <a
              className="ig-logo-link"
              href="https://www.instagram.com/beyondtaiwan"
              target="_blank"
              rel="noreferrer"
            >
              <img
                className="ig-logo"
                src={require("../images/ig-logo.png")}
                alt=""
              />
            </a>
            <a
              className="fb-logo-link"
              href="https://www.facebook.com/beyondtaiwan2020/"
              target="_blank"
              rel="noreferrer"
            >
              <img
                className="fb-logo"
                src={require("../images/fb-logo.png")}
                alt=""
              />
            </a>
            <a
              className="linkedin-logo-link"
              href="https://www.linkedin.com/company/beyond-taiwan"
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
    );
  }
}
