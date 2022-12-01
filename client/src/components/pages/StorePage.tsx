import React from "react";
import { User } from "../../util";

const Store = ({ user }: { user: User }) => {
  return (
    <div className="flex flex-column primary-text">
      <h1 className="tc f-subheadline ma0 pa0 ">Store</h1>
      <h2 className="tc mh4">Store here</h2>
    </div>
  );
};

export default Store;
