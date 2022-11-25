import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button, TextField } from "@mui/material";
import { Task, List, MUI_BUTTON_STYLE } from "../../util";
import Markdown from "../modules/Markdown";
import NotFound from "./NotFoundPage";

const TEMP_TASKS = [
  { _id: "1", content: "take out trash" },
  { _id: "2", content: "do laundry" },
  { _id: "3", content: "*hey*, this` markdown` is pretty **cool**!" },
];
const TEMP_LIST = { _id: "1", title: "Chores" };

const ListPage = () => {
  const { listId } = useParams();
  const [tasks, setTasks] = React.useState<Task[]>();
  const [list, setList] = React.useState<List>();
  const [newTask, setNewTask] = React.useState<Task>({
    _id: "Not set",
    content: "",
  });

  useEffect(() => {
    // add api call here to fetch tasks for this id
    setTasks(TEMP_TASKS);
    setList(TEMP_LIST);
  }, [listId]);

  const submitTask = () => {
    console.log("submitting task: ", newTask);
  };

  if (list === undefined) return <></>;
  if (list === null) return <NotFound />;
  return (
    <div className="flex flex-column primary-text">
      <h1 className="tc f-subheadline ma0 pa0 ">{list.title}</h1>
      <h2 className="tc mh4">List stuff here</h2>
      <div className="flex flex-column w-70 m-auto">
        {tasks?.map((task) => (
          <TaskNode task={task} />
        ))}
        <hr />
        <TextField
          placeholder="Write a new task..."
          className="bg-near-white ma1"
          value={newTask.content}
          onChange={(e) => setNewTask({ ...newTask, content: e.target.value })}
        />
        <Button
          onClick={submitTask}
          style={MUI_BUTTON_STYLE}
          variant="contained"
        >
          Create Task
        </Button>
      </div>
    </div>
  );
};

const TaskNode = ({ task }: { task: Task }) => (
  <div className="pa2 ma2 bg-near-white ba b--near-black">
    <Markdown>{task.content}</Markdown>
  </div>
);

export default ListPage;
