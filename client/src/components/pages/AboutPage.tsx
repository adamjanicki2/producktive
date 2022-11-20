import React from "react";
import logo from "../../logo.svg";

const About = () => {
  return (
    <div className="flex flex-column">
      <h1 className="tc f-subheadline ma0 pa0">About</h1>
      <h2 className="tc mh4">
        This is a skeleton that can you can use to build a web app. It uses a
        React frontend, an express backend, and a MongoDB database. You can
        deploy it to Vercel for free.
      </h2>
      <img src={logo} className="App-logo" alt="Donut" />
    </div>
  );
};

export default About;
