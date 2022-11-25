import type { Task } from "./model";

export const formatDate = (date: Date) => date.toLocaleDateString();

export const constructTaskResponse = (task: Task) => {
  const def = {
    _id: task._id.toString(),
    userId: task.userId.toString(),
    content: task.content,
    difficulty: task.difficulty,
    parent: task.parent,
  };
  return task.deadline ? { ...def, deadline: formatDate(task.deadline) } : def;
};
