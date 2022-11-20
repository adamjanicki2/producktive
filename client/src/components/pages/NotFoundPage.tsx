import React from "react";
import logo from "../../logo.svg";

const Oops = () => {
  return (
    <div className="flex flex-column">
      <h1 className="tc f-subheadline ma0 pa0">404</h1>
      <h2 className="tc">
        The requested page '{window.location.pathname}' could not be found.
      </h2>
      <img src={logo} className="App-logo" alt="Donut" />
    </div>
  );
};

export default Oops;
