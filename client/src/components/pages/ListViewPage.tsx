import React from "react";
import { User } from "../../util";
import ListSection from "../modules/ListSection";
import SideNav from "../modules/SideNav";

const View = ({
  user,
  updateUser,
}: {
  user?: User;
  updateUser: (user: User) => void;
}) => {
  return (
    <div className="flex flex-row w-100">
      <SideNav />
      <div className="flex flex-column w-80">
        <h1 className="tc f-subheadline ma0 pa0 ">Upcoming</h1>
        <ListSection
          endpoint="/api/tasks/today"
          user={user}
          updateUser={updateUser}
          noTasksMessage="You have no tasks today!"
        />
      </div>
    </div>
  );
};

export default View;
