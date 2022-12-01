import React from "react";
import { User, get } from "../../util";
import Duck from "../modules/Duck";

const PetPage = ({ user }: { user?: User }) => {
  const [pet, setPet] = React.useState();

  React.useEffect(() => {
    get(`/api/pets/${user.username}`).then((pet) => {
      pet && setPet(pet);
    });
  }, [user.username]);

  return (
    <div className="flex flex-column primary-text">
      <h1 className="tc f-subheadline ma0 pa0">Pet</h1>
      {user && <h2 className="tc mh4">{JSON.stringify(user)}</h2>}
      {pet && <h2 className="tc mh4">{JSON.stringify(pet)}</h2>}
      <Duck size={400} beakColor="orange" bodyColor="yellow" />
    </div>
  );
};

export default PetPage;
