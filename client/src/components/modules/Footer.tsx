import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer-align bt bw1 b--primary-text pv3 primary-text normal flex flex-row items-center justify-between">
      <div className="flex flex-row items-center ml3 ">
        © 2022 Producktive Inc.
      </div>
      <div className="flex flex-row items-center justify-around mr3">
        <Link
          to="/about/"
          className="ml3 primary-text no-underline underline-hover"
        >
          About Us
        </Link>
        <div className="ml3"> Duck! </div>
        <div className="ml3"> Terms and Conditions </div>
      </div>
    </footer>
  );
};

export default Footer;
