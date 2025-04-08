import React from "react";
import "../../styles/Footer.css"; // Import the CSS file

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p className="copyright">
          &copy; {new Date().getFullYear()} Magma. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
