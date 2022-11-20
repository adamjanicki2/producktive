import React from "react";
import logo from "../../logo.svg";
import { Link } from "react-router-dom";

const Nav = () => {
  return (
    <nav className="bg-primary w-100 ma0 pa0">
      <div className="flex flex-row items-center justify-between ml3">
        <Link
          className="flex flex-row items-center pointer dim no-underline black"
          to="/"
        >
          <img src={logo} width="32px" height="32px" alt="Logo" />
          <h1 className="i">Skeleton</h1>
        </Link>
        <div className="flex flex-row items-center justify-around mr3">
          <Link className="no-underline black dim f3 fw3" to="/about/">
            About
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
