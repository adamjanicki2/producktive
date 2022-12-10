import type { Task } from "./model";
import TaskCollection from "./collection";

export const formatDate = (date: Date) => date.toLocaleDateString();

export const constructTaskResponse = async (task: Task): Promise<Object> => {
  const def = {
    _id: task._id.toString(),
    userId: task.userId.toString(),
    content: task.content,
    difficulty: task.difficulty,
    parent: task.parent,
    completed: task.completed,
    reward: await TaskCollection.getCoin(task._id)
  };
  return await { ...def, deadline: formatDate(task.deadline) };
};

