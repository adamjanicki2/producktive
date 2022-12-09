import React from "react";
import SideNav from "../modules/SideNav";

export default () => {
  return (
    <div className="flex flex-row w-100">
      <SideNav />
      <div className="flex flex-column w-80">
        <h1 className="tc f-subheadline ma0 pa0 ">Your Lists</h1>
      </div>
    </div>
  );
};
