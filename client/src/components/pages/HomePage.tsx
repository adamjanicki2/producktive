import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { get, Pet, Task, User, del, patch } from "../../util";
import Duck from "../modules/Duck";
import { TaskNode } from "./ListPage";

const Home = ({
  user,
  updateUser,
}: {
  user?: User;
  updateUser: (user: User) => void;
}) => {
  const [ducks, setDucks] = React.useState<Pet[]>([]);
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [search, setSearch] = React.useState("");

  useEffect(() => {
    const setup = async () => {
      const pets = await get("/api/pets/all");
      setDucks(pets);
      const tasks = await get("/api/tasks/today");
      !tasks?.error && setTasks(tasks);
    };
    setup();
  }, []);

  const deleteTask = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      const task = await del(`/api/tasks/${id}`);
      if (task?.error) {
        return window.alert(task.error);
      } else {
        setTasks(tasks.filter((t) => t._id !== id));
      }
    }
  };

  const searchDucks = async () => {
    const endpoint = `/api/pets/${search || "all"}`;
    const pets = await get(endpoint);
    setDucks(search ? [pets] : pets);
    setSearch("");
  };

  const completeTask = async (id: string) => {
    const res = await patch(`/api/tasks/complete/${id}`);
    if (res?.error) {
      return window.alert(res.error);
    } else {
      setTasks(
        tasks.map((t) => (t._id === id ? { ...t, completed: true } : t))
      );
      const { coinsDelta } = res;
      updateUser({ ...user, coins: user.coins + coinsDelta });
    }
  };

  const editTask = async (id: string, content: string) => {
    const res = await patch(`/api/tasks/${id}`, { content });
    if (res?.error) {
      return window.alert(res.error);
    } else {
      setTasks(tasks.map((t) => (t._id === id ? { ...t, content } : t)));
    }
  };

  return user && ducks.length > 0 ? (
    <div className="flex flex-column primary-text">
      <h1 className="tc f-subheadline ma0 pa0">Home</h1>
      <Link
        to="/about/"
        className="f3 fw3 primary-text no-underline underline-hover tc"
      >
        How does Producktive Work?
      </Link>
      <h1 className="tc f1">Your Upcoming Tasks</h1>
      {!tasks.length && (
        <h2 className="tc">You do not have any tasks for today!</h2>
      )}
      <div className="flex flex-column w-70 m-auto">
        {tasks.map((task, index) => (
          <TaskNode
            key={`task${index}`}
            task={task}
            deleteTask={deleteTask}
            completeTask={completeTask}
            editTask={editTask}
          />
        ))}
      </div>
      <hr className="near-black b--near-black ba bw1 w-80" />
      <h1 className="tc f1 primary-text">Check out everyone's ducks!</h1>
      <div className="flex flex-row items-center m-auto">
        <TextField
          className="bg-near-white"
          placeholder="Search by username"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button onClick={searchDucks}>Search</Button>
      </div>
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
              petHealth={duck.health}
            />
            <h1 className="i ma0 pa0">{duck.petName}</h1>
            <h2>({(duck.userId as any).username}'s Duck)</h2>
            <hr className="moon-gray b--moon-gray ba bw1 w-60" />
          </div>
        ))}
    </div>
  ) : (
    <div>
      <h1 className="tc f1 primary-text">Check out everyone's ducks!</h1>
      {ducks.map((duck, index) => (
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
            petHealth={duck.health}
          />
          <h1 className="i ma0 pa0">{duck.petName}</h1>
          <h2>({(duck.userId as any).username}'s Duck)</h2>
          <hr className="moon-gray b--moon-gray ba bw1 w-60" />
        </div>
      ))}
    </div>
  );
};

export default Home;
