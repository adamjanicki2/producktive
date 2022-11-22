import type { Types } from "mongoose";
import { Schema, model } from "mongoose";
import {List} from '../list/model';

export type Task = {
  _id: Types.ObjectId;
  list: List;
  name: string;
  deadline: Date;
  difficulty: string;
  notes: string;
};

const TaskSchema = new Schema({
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
