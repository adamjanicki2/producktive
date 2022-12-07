import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import moment from 'moment'
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
  User
} from "../../util";
import Markdown from "../modules/Markdown";
import NotFound from "./NotFoundPage";
import DeleteIcon from "@mui/icons-material/Delete";
import { DesktopDatePicker as DatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { CheckCircleOutline, Edit, Lock } from "@mui/icons-material";

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
          }
        });
      }
    });
  }, [listId]);

  const submitTask = () => {
    const taskToSubmit = newTask.deadline
      ? {
          listId,
          content: newTask.content,
          difficulty: newTask.difficulty,
          deadline: newTask.deadline,
        }
      : { listId, content: newTask.content, difficulty: newTask.difficulty };
    post(`/api/tasks/`, taskToSubmit).then((task) => {
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

  const completeTask = (id: string) => {
    patch(`/api/tasks/complete/${id}`).then((res) => {
      if (res?.error) {
        return window.alert(res.error);
      } else {
        setTasks(
          tasks.map((t) => (t._id === id ? { ...t, completed: true } : t))
        );
        const { coinsDelta } = res;
        updateUser({ ...user, coins: user.coins + coinsDelta });
      }
    });
  };

  const editTask = (id: string, content: string) => {
    patch(`/api/tasks/${id}`, { content }).then((res) => {
      if (res?.error) {
        return window.alert(res.error);
      } else {
        setTasks(tasks.map((t) => (t._id === id ? { ...t, content } : t)));
      }
    });
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
        <div className="flex flex-row items-center m-auto">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              minDate={new Date()}
              className="bg-near-white mv2"
              inputFormat="MM/DD/YYYY"
              value={newTask.deadline}
              onChange={(value) => {
                const date = (value as any).$d.toLocaleDateString() as string;
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
          onClick={() => { submitTask(); setNewTask({ ...newTask, deadline: null });}}
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
  medium: "orange",
  hard: "dark-red",
} as const;

export const TaskNode = ({
  task,
  deleteTask,
  completeTask,
  editTask,
}: {
  task: Task;
  deleteTask?: (id: string) => void;
  completeTask?: (id: string) => void;
  editTask?: (id: string, content: string) => void;
}) => {
  const [editing, setEditing] = React.useState<boolean>(false);
  const [content, setContent] = React.useState<string>(task.content);

  return (
    <div
      className={`flex flex-column pa2 mv2 ba b--near-black ${
        task.completed ? "bg-moon-gray" : "bg-near-white"
      }`}
    >
      {editing ? (
        <TextField
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      ) : (
        <Markdown>
          {task.completed ? `~~${task.content}~~` : task.content}
        </Markdown>
      )}{" "}
      <div className="flex flex-row items-center">
        {!task.completed && editTask && (
          <Tooltip arrow title={editing ? "Done" : "Edit"}>
            <IconButton
              onClick={() => {
                if (editing) {
                  editTask(task._id, content);
                }
                setEditing(!editing);
              }}
            >
              {editing ? (
                <Lock className="black" />
              ) : (
                <Edit className="black" />
              )}
            </IconButton>
          </Tooltip>
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
        {task.deadline && <span>Complete by: {moment(task.deadline).format('MM/DD/YYYY')}</span>}
      </span>
    </div>
  );
};

export default ListPage;
