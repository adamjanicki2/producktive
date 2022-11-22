import type { HydratedDocument, Types } from "mongoose";
import UserCollection from "../user/collection";
import ListCollection from "../list/collection";
import type { Task } from "./model";
import TaskModel from "./model";

class TaskCollection {
  /**
   * Add a new task
   * 
   * @param {string} userId
   * @param {string} name - the name of the task
   * @param {string} date - the date of completion for the dask
   * @param {string} list_name - the name of the list the task will be in
   * @param {string} difficulty - the difficulty of the task
   * @param {string} notes - the notes for a task
   * @return {Promise<HydratedDocument<Task>>} - the newly created task
   */
  static async addOne(
    userId: Types.ObjectId | string,
    name: string,
    date: string,
    list_name: string,
    difficulty: string,
    notes: string
  ): Promise<HydratedDocument<Task>> {
    const user = await UserCollection.findOneByUserId(userId);
    const list = await ListCollection.findOnebyName(list_name);
    const deadline = new Date(date); //needs format 'yyyy-mm-dd'
    const task = new TaskModel({ user, list, name, deadline, difficulty, notes });
    await task.save();
    return task;
  }

  /**
   * Find a task by task id
   * 
   * @param {string} taskId - the taskId of the task to find
   * @return {Promise<HydratedDocument<Task>>} - the task with that taskId
   */
  static async findOnebyTaskId(
    taskId: Types.ObjectId | string
  ): Promise<HydratedDocument<Task> | null> {
    return TaskModel.findById(taskId);
  }

  /**
   * Updates a task from the collection
   * 
   * @param {string} taskId
   * @param {Object} taskDetails
   * @return {Promise<HydratedDocument<Task>>}
   */
  static async updateOne(
    taskId: Types.ObjectId | string,
    taskDetails: any
  ): Promise<HydratedDocument<Task>> {
    const task = await TaskModel.findById(taskId);
    if(taskDetails.name) {
      task!.name = taskDetails.name;
    }
    if(taskDetails.date) {
      const deadline = new Date(taskDetails.date); //format yyyy-mm-dd and turns into date object
      task!.deadline = deadline;
    }
    if(taskDetails.difficulty){
      task!.difficulty = taskDetails.difficulty;
    }
    
    task!.notes = taskDetails.notes; //in case notes is changed to empty

    await task!.save();
    return task!;
  }

  /**
   * Deletes a task form the collection
   * 
   * @param {string} taskId - the taskId of the task to delete
   * @return {Promise<Boolean>} - true if the task has been deleted, false otherwise
   */
  static async deleteOne(
    taskId: Types.ObjectId | string
  ): Promise<Boolean> {
    const task = await TaskModel.deleteOne({_id: taskId});
    return task !== null;
  }

}

export default TaskCollection;
