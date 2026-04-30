import React from "react";

export default function Footer() {
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
  );
}
