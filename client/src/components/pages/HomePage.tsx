import React, { useEffect } from "react";
import { get, Pet, Task, User } from "../../util";
import Duck from "../modules/Duck";
import { TaskNode } from "./ListPage";

const Home = ({ user }: { user?: User }) => {
  const [ducks, setDucks] = React.useState<Pet[]>([]);
  const [tasks, setTasks] = React.useState<Task[]>([]);

  useEffect(() => {
    get("/api/pets/all").then((pets) => {
      console.log(pets);
      setDucks(pets);
    });
    get("/api/tasks/today").then((tasks) => {
      console.log(tasks);
      !tasks?.error && setTasks(tasks);
    });
  }, []);

  return user && ducks.length > 0 ? (
    <div className="flex flex-column primary-text">
      <h1 className="tc f-subheadline ma0 pa0">Home</h1>
      <h1 className="tc f1">Your Tasks for Today</h1>
      {!tasks.length && (
        <h2 className="tc">You do not have any tasks for today!</h2>
      )}
      <div className="flex flex-column w-70 m-auto">
        {tasks.map((task, index) => (
          <TaskNode key={`task${index}`} task={task} />
        ))}
      </div>
      <hr className="near-black b--near-black ba bw1 w-80" />
      <h1 className="tc f1">Check out everyone's ducks!</h1>
      {ducks
        .filter((duck) => (duck.userId as any)._id !== user._id)
        .map((duck, index) => (
          <div
            key={`duck${index}`}
            className="flex flex-column items-center justify-center"
          >
            <h2>Health: {duck.health}</h2>
            <div className="ba bw1 br2 b--near-black w-50">
              <div
                className={
                  duck.health < 33
                    ? "bg-dark-red"
                    : duck.health < 66
                    ? "bg-yellow"
                    : "bg-green"
                }
                style={{ height: 20, width: `${duck.health}%` }}
              ></div>
            </div>
            <Duck
              size={260}
              beakColor={duck.itemsOn.beak}
              bodyColor={duck.itemsOn.duck}
            />
            <h1 className="i ma0 pa0">{duck.petName}</h1>
            <h2>({(duck.userId as any).username}'s Duck)</h2>
            <hr className="moon-gray b--moon-gray ba bw1 w-60" />
          </div>
        ))}
    </div>
  ) : (
    <p>Loading...</p>
  );
};

export default Home;
