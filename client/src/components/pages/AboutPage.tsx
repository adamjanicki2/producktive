import React from "react";
import logo from "../../logo.svg";

const About = () => {
  return (
    <div className="flex flex-column primary-text">
      <h1 className="tc f-subheadline ma0 pa0 ">How it Works</h1>
      <p className="f3 fw3 ph4 mh2">
        Producktive is a productivity app that helps you get things done.
        Complete tasks to win coins to feed your duck! Your duck will
        automatically lose 5% health each day, so it's important to keep it fed!
        Feeding your duck will increase its health, leading to a more loving
        duck. You can buy coins with food, and also different customizations for
        your duck, like duck and beak color. Finishing tasks late will have a
        negative impact on the amount of coins you receive, so be sure to
        complete your tasks on time!
        <br />
        Thanks, and happy duck feeding!
        <br />
        <br /> - The Producktive Dev Team
      </p>
      <img src={logo} className="App-logo" alt="Duck" />
    </div>
  );
};

export default About;
