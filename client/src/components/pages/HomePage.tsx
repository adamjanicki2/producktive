import React from "react";
import logo from "../../logo.svg";

const Home = () => {
  return (
    <div className="flex flex-column">
      <h1 className="tc f-subheadline ma0 pa0">Home</h1>
      <h2 className="tc">
        Check the <code>README.md</code> file for a full breakdown of how this
        skeleton works.
      </h2>
      <img src={logo} className="App-logo" alt="Donut" />
    </div>
  );
};

export default Home;
