import React from "react";
import logo from "../../logo.svg";

const About = () => {
  return (
    <div className="flex flex-column">
      <h1 className="tc f-subheadline ma0 pa0">About</h1>
      <h2 className="tc mh4">Write about Producktive here!</h2>
      <img src={logo} className="App-logo" alt="Donut" />
    </div>
  );
};

export default About;
