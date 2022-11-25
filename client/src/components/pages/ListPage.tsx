import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button, IconButton, MenuItem, Select, TextField } from "@mui/material";
import { Task, List, MUI_BUTTON_STYLE, get, post, del } from "../../util";
import Markdown from "../modules/Markdown";
import NotFound from "./NotFoundPage";
import DeleteIcon from "@mui/icons-material/Delete";

const DEFAULT_TASK: Task = { _id: "Not set", content: "", difficulty: "easy" };

const ListPage = () => {
  const { listId } = useParams();
  const [tasks, setTasks] = React.useState<Task[]>();
  const [list, setList] = React.useState<List>();
  const [newTask, setNewTask] = React.useState<Task>({ ...DEFAULT_TASK });

  useEffect(() => {
    get(`/api/lists/${listId}`).then((list) => {
      if (list.error) {
        setList(null);
        setTasks(null);
      } else {
        setList(list);
        get(`/api/tasks/${listId}`).then((tasks) => {
          if (tasks?.error) {
            setTasks([]);
            window.alert("Error getting tasks");
          } else {
            setTasks(tasks);
            console.log({ list, tasks });
          }
        });
      }
    });
  }, [listId]);

  const submitTask = () => {
    post(`/api/tasks/`, {
      content: newTask.content,
      difficulty: newTask.difficulty,
      listId,
    }).then((task) => {
      if (task?.error) {
        window.alert(task.error);
      } else {
        setTasks([...(tasks || []), task]);
        setNewTask({ ...DEFAULT_TASK });
      }
    });
  };

  const deleteTask = (id: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      del(`/api/tasks/${id}`).then((task) => {
        if (task?.error) {
          return window.alert(task.error);
        } else {
          setTasks(tasks.filter((t) => t._id !== id));
        }
      });
    }
  };

  if (list === undefined) return <></>;
  if (list === null) return <NotFound />;
  return (
    <div className="flex flex-column primary-text">
      <h1 className="tc f-subheadline ma0 pa0 ">{list.title}</h1>
      {tasks?.length && <h2 className="tc mh4">Tasks ({tasks.length})</h2>}
      <div className="flex flex-column w-70 m-auto">
        {!tasks?.length && <h3>You do not have any tasks on this list!</h3>}
        {tasks?.map((task, index) => (
          <TaskNode key={`task${index}`} task={task} deleteTask={deleteTask} />
        ))}
        <hr />
        <TextField
          placeholder="Write a new task..."
          className="bg-near-white mv2"
          value={newTask.content}
          onChange={(e) => setNewTask({ ...newTask, content: e.target.value })}
        />
        <Select
          value={newTask.difficulty}
          onChange={(e) =>
            setNewTask({
              ...newTask,
              difficulty: e.target.value as Task["difficulty"],
            })
          }
          className="bg-near-white mv2"
        >
          <MenuItem value="easy">Easy</MenuItem>
          <MenuItem value="medium">Medium</MenuItem>
          <MenuItem value="hard">Hard</MenuItem>
        </Select>
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

const DIFF_TO_COLOR = {
  easy: "green",
  medium: "yellow",
  hard: "dark-red",
} as const;

const TaskNode = ({
  task,
  deleteTask,
}: {
  task: Task;
  deleteTask: (id: string) => void;
}) => (
  <div className="pa2 mv2 bg-near-white ba b--near-black">
    <Markdown>{task.content}</Markdown>{" "}
    <span className={DIFF_TO_COLOR[task.difficulty] + " b i"}>
      {task.difficulty}
    </span>
    <IconButton onClick={() => deleteTask(task._id)}>
      <DeleteIcon />
    </IconButton>
  </div>
);

export default ListPage;
