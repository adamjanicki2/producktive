import type { Types } from "mongoose";
import { Schema, model } from "mongoose";
import { List } from "../list/model";

export type Task = {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  parent: List;
  content: string;
  completed: boolean;
  deadline?: Date;
  difficulty: "easy" | "medium" | "hard";
};

const TaskSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  //the list the task belongs to
  parent: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "List",
  },
  //the content of the task
  content: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    required: true,
  },
  //the deadline of the task
  deadline: {
    type: Date,
    required: false,
  },
  //the difficulty of the task
  difficulty: {
    type: String,
    required: true,
  },
});

const TaskModel = model<Task>("Task", TaskSchema);
export default TaskModel;
