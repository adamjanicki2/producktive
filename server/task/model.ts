import type { Types } from "mongoose";
import { Schema, model } from "mongoose";
import {List} from '../list/model';
import { User } from "../user/model";

export type Task = {
  _id: Types.ObjectId;
  user: User;
  list: List;
  name: string;
  deadline: Date;
  difficulty: string;
  notes: string;
};

const TaskSchema = new Schema({
  //the user who made the task
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  //the list the task belongs to
  list: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'List'
  },
  //the name of the task
  name: {
    type: String,
    required: true
  },
  //the deadline of the task
  deadline: {
    type: Date,
    required: true
  },
  //the difficulty of the task
  difficulty: {
    type: String,
    required: true
  },
  //any notes for the task
  notes: {
    type: String,
    required: false
  }
});

const TaskModel = model<Task>("Task", TaskSchema);
export default TaskModel;
