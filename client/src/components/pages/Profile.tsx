import React from "react";
import { User } from "../../util";

const Profile = ({ user }: { user?: User }) => {
  return (
    <div className="flex flex-column">
      <h1 className="tc f-subheadline ma0 pa0">Profile</h1>
      {user && <h2 className="tc mh4">{JSON.stringify(user)}</h2>}
    </div>
  );
};

export default Profile;
