import React from "react";
import { Task, del, patch, get, User } from "../../util";
import { TaskNode } from "../pages/ListPage";

const ListSection = ({
  endpoint,
  user,
  updateUser,
  noTasksMessage,
}: {
  endpoint: string;
  user?: User;
  updateUser: (user: User) => void;
  noTasksMessage?: string;
}) => {
  React.useEffect(() => {
    const setup = async () => {
      const tasks = await get(endpoint);
      !tasks?.error && setTasks(tasks);
    };
    setup();
  }, [endpoint]);
  const [tasks, setTasks] = React.useState<Task[]>([]);

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

  const editTask = async (
    id: string,
    content: string,
    difficulty: Task["difficulty"],
    deadline: Task["deadline"]
  ) => {
    const res = await patch(`/api/tasks/${id}`, {
      content,
      difficulty,
      date: deadline,
    });
    if (res?.error) {
      return window.alert(res.error);
    } else {
      setTasks(tasks.map((t) => (t._id === id ? res : t)));
    }
  };

  return !tasks || !tasks.length ? (
    <h2 className="tc">{noTasksMessage ?? "No tasks :("}</h2>
  ) : (
    <div className="flex flex-column w-70 m-auto">
      {tasks.map((task, index) => (
        <TaskNode
          key={`task${index}`}
          task={task}
          deleteTask={deleteTask}
          completeTask={completeTask}
          editTask={editTask}
          showList
        />
      ))}
    </div>
  );
};

export default ListSection;
