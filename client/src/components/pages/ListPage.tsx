import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import moment from "moment";
import {
  Button,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from "@mui/material";
import {
  Task,
  List,
  MUI_BUTTON_STYLE,
  get,
  post,
  del,
  patch,
  User,
} from "../../util";
import Markdown from "../modules/Markdown";
import DeleteIcon from "@mui/icons-material/Delete";
import { DesktopDatePicker as DatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { CheckCircleOutline, Edit } from "@mui/icons-material";
import SideNav from "../modules/SideNav";

const DEFAULT_TASK: Partial<Task> = {
  content: "",
  difficulty: "easy",
  deadline: "",
};

const ListPage = ({
  user,
  updateUser,
}: {
  user?: User;
  updateUser: (user: User) => void;
}) => {
  const { listId } = useParams();
  const [tasks, setTasks] = React.useState<Task[]>();
  const [list, setList] = React.useState<List>();
  const [newTask, setNewTask] = React.useState<Partial<Task>>({
    ...DEFAULT_TASK,
  });

  useEffect(() => {
    const setup = async () => {
      const list = await get(`/api/lists/${listId}`);
      if (list.error) {
        setList(null);
        setTasks(null);
      } else {
        setList(list);
        const tasks = await get(`/api/tasks/${listId}`);
        if (tasks?.error) {
          setTasks([]);
          // window.alert("Error getting tasks");
        } else {
          setTasks(tasks);
        }
      }
    };
    setup();
  }, [listId]);

  const submitTask = async () => {
    const taskToSubmit = newTask.deadline
      ? {
          listId,
          content: newTask.content,
          difficulty: newTask.difficulty,
          deadline: newTask.deadline,
        }
      : { listId, content: newTask.content, difficulty: newTask.difficulty };
    const task = await post(`/api/tasks/`, taskToSubmit);
    if (task?.error) {
      window.alert(task.error);
    } else {
      setTasks([...(tasks || []), task]);
      setNewTask({ ...DEFAULT_TASK });
    }
  };

  const deleteTask = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      const task = await del(`/api/tasks/${id}`);
      if (task?.error) {
        window.alert(task.error);
      } else {
        setTasks(tasks.filter((t) => t._id !== id));
      }
    }
  };

  const completeTask = async (id: string) => {
    const res = await patch(`/api/tasks/complete/${id}`);
    if (res?.error) {
      window.alert(res.error);
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

  if (list === undefined) return <></>;
  return (
    <div className="flex flex-row w-100">
      <SideNav />
      <div className="flex flex-column primary-text w-80">
        <h1 className="tc f-subheadline ma0 pa0 ">
          {list?.title ?? "Select or Create a List"}
        </h1>
        {tasks?.length && <h2 className="tc mh4">Tasks ({tasks.length})</h2>}
        {list && (
          <div className="flex flex-column w-70 m-auto">
            {!tasks?.length && <h3>You do not have any tasks on this list!</h3>}
            {tasks?.map((task, index) => (
              <TaskNode
                key={`task${index}`}
                task={task}
                deleteTask={deleteTask}
                completeTask={completeTask}
                editTask={editTask}
              />
            ))}
            <hr />
            <TextField
              placeholder="Write a new task (markdown enabled!)"
              className="bg-near-white mv2"
              value={newTask.content}
              onChange={(e) =>
                setNewTask({ ...newTask, content: e.target.value })
              }
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
            <div className="flex flex-row items-center m-auto">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  minDate={new Date()}
                  className="bg-near-white mv2"
                  inputFormat="MM/DD/YYYY"
                  value={newTask.deadline}
                  onChange={(value) => {
                    const date = (
                      value as any
                    ).$d.toLocaleDateString() as string;
                    setNewTask({ ...newTask, deadline: date });
                  }}
                  renderInput={(params) => (
                    <TextField
                      placeholder="leave blank for no deadline"
                      onKeyDown={(e) => e.preventDefault()}
                      {...params}
                    />
                  )}
                />
              </LocalizationProvider>
              <Button
                style={MUI_BUTTON_STYLE}
                variant="contained"
                onClick={() => setNewTask({ ...newTask, deadline: null })}
              >
                Clear
              </Button>
            </div>
            <Button
              onClick={() => {
                submitTask();
                setNewTask({ ...newTask, deadline: null });
              }}
              style={MUI_BUTTON_STYLE}
              variant="contained"
            >
              Create Task
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

const DIFF_TO_COLOR = {
  easy: "green",
  medium: "orange",
  hard: "dark-red",
} as const;

export const TaskNode = ({
  task,
  deleteTask,
  completeTask,
  editTask,
  showList,
}: {
  task: Task;
  deleteTask?: (id: string) => void;
  completeTask?: (id: string) => void;
  editTask?: (
    id: string,
    content: string,
    difficulty: Task["difficulty"],
    deadline: Task["deadline"]
  ) => void;
  showList?: boolean;
}) => {
  const [editing, setEditing] = React.useState<boolean>(false);
  const [content, setContent] = React.useState<string>(task.content);
  const [difficulty, setDifficulty] = React.useState<Task["difficulty"]>(
    task.difficulty
  );
  const [deadline, setDeadline] = React.useState<Task["deadline"]>(
    task.deadline
  );

  return (
    <div
      className={`flex flex-column pa2 mv2 ba b--near-black ${
        task.completed ? "bg-moon-gray" : "bg-near-white"
      }`}
    >
      {showList && (
        <Link
          className="no-underline underline-hover f3 fw4"
          to={`/list/${task.parent._id}`}
        >
          {task.parent.title}
        </Link>
      )}
      {editing ? (
        <div className="flex flex-row items-center">
          <TextField
            className="mr2"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              minDate={new Date()}
              className="bg-near-white ma2"
              inputFormat="MM/DD/YYYY"
              value={deadline}
              onChange={(value) => {
                const date = (value as any).$d.toLocaleDateString() as string;
                setDeadline(date);
              }}
              renderInput={(params) => (
                <TextField
                  placeholder="leave blank for no deadline"
                  onKeyDown={(e) => e.preventDefault()}
                  {...params}
                />
              )}
            />
          </LocalizationProvider>
          <Select
            value={difficulty}
            onChange={(e) =>
              setDifficulty(e.target.value as Task["difficulty"])
            }
            className="bg-near-white mv2 ml2"
          >
            <MenuItem value="easy">Easy</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="hard">Hard</MenuItem>
          </Select>
        </div>
      ) : (
        <Markdown>
          {task.completed ? `~~${task.content}~~` : task.content}
        </Markdown>
      )}{" "}
      <div className="flex flex-row items-center">
        {!task.completed && (
          <>
            {!task.completed && editTask && editing ? (
              <div className="mv2">
                <Button
                  variant="contained"
                  onClick={() => {
                    if (editing) {
                      editTask(task._id, content, difficulty, deadline);
                    }
                    setEditing(!editing);
                  }}
                >
                  Save
                </Button>
              </div>
            ) : (
              <IconButton>
                <Edit
                  className="black"
                  onClick={() => {
                    setEditing(!editing);
                  }}
                />
              </IconButton>
            )}
          </>
        )}
        {!task.completed && completeTask && (
          <Tooltip arrow title="Complete">
            <IconButton onClick={() => completeTask(task._id)} className="w-fc">
              <CheckCircleOutline className="green" />
            </IconButton>
          </Tooltip>
        )}
        {deleteTask && (
          <Tooltip arrow title="Delete">
            <IconButton onClick={() => deleteTask(task._id)} className="w-fc">
              <DeleteIcon className="dark-red" />
            </IconButton>
          </Tooltip>
        )}
      </div>
      <span>
        <span className={DIFF_TO_COLOR[task.difficulty] + " b i"}>
          {task.difficulty}
        </span>{" "}
        {task.deadline && (
          <span>Complete by: {moment(task.deadline).format("MM/DD/YYYY")}</span>
        )}
      </span>
    </div>
  );
};

export default ListPage;
