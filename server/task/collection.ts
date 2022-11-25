import type { HydratedDocument, Types } from "mongoose";
import type { Task } from "./model";
import TaskModel from "./model";

class TaskCollection {
  static async addOne(
    userId: Types.ObjectId | string,
    listId: Types.ObjectId | string,
    content: string,
    difficulty: string,
    date?: string
  ): Promise<HydratedDocument<Task>> {
    let taskObj: Object = { userId, listId, content, difficulty };
    if (date) {
      taskObj = { ...taskObj, deadline: new Date(date) }; //needs format 'yyyy-mm-dd'
    }
    const task = new TaskModel(taskObj);
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

  static async findByParentId(
    parentId: Types.ObjectId | string
  ): Promise<HydratedDocument<Task>[]> {
    return TaskModel.find({ parent: parentId }).populate("parent");
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
    if (taskDetails.content) {
      task!.content = taskDetails.content;
    }
    if (taskDetails.date) {
      const deadline = new Date(taskDetails.date); //format yyyy-mm-dd and turns into date object
      task!.deadline = deadline;
    }
    if (taskDetails.difficulty) {
      task!.difficulty = taskDetails.difficulty;
    }

    await task!.save();
    return task!;
  }

  /**
   * Deletes a task form the collection
   *
   * @param {string} taskId - the taskId of the task to delete
   * @return {Promise<Boolean>} - true if the task has been deleted, false otherwise
   */
  static async deleteOne(taskId: Types.ObjectId | string): Promise<Boolean> {
    const task = await TaskModel.deleteOne({ _id: taskId });
    return task !== null;
  }
}

export default TaskCollection;
