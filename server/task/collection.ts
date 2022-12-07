import type { HydratedDocument, Types } from "mongoose";
import { User } from "../user/model";
import type { Task } from "./model";
import TaskModel from "./model";
import { coins } from "../common/util";
import UserCollection from "../user/collection";

const NOTIF_TO_DELTA = {
  none: 0,
  daily: 1,
  weekly: 7,
  monthly: 30,
} as const;
class TaskCollection {
  static async addOne(
    userId: Types.ObjectId | string,
    listId: Types.ObjectId | string,
    content: string,
    difficulty: "easy" | "medium" | "hard",
    date: string
  ): Promise<HydratedDocument<Task>> {
    let taskObj: Object = {
      userId,
      parent: listId,
      content,
      difficulty,
      completed: false,
    };
    if (date) {
      taskObj = { ...taskObj, deadline: new Date(date) };
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

  static async getUpcomingTasks(
    userId: Types.ObjectId | string,
    notifPeriod: User["notifPeriod"],
    limit?: number
  ): Promise<HydratedDocument<Task>[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + NOTIF_TO_DELTA[notifPeriod]);
    return TaskModel.find({ userId, deadline: { $gte: today, $lt: tomorrow } })
      .sort({ deadline: "asc" })
      .limit(limit || 20)
      .populate("parent");
  }

  static async getHomeTasks(
    userId: Types.ObjectId | string,
    limit?: number
  ): Promise<HydratedDocument<Task>[]> {
    return TaskModel.find({ userId, completed: false  })
      .sort({ deadline: "asc" })
      .limit(limit || 20)
      .populate("parent");
  }


  /**
   * Deletes a task form the collection
   *
   * @param {string} taskId - the taskId of the task to delete
   * @return {Promise<Boolean>} - true if the task has been deleted, false otherwise
   */
  static async deleteOne(taskId: Types.ObjectId | string): Promise<boolean> {
    const task = await TaskModel.deleteOne({ _id: taskId });
    return task !== null;
  }

  /**
   * Completes a task
   */
  static async completeOne(userId: Types.ObjectId | string, taskId: Types.ObjectId | string): Promise<number> {
    const task = await TaskModel.findById(taskId);
    const completed = new Date();
    const deadline = task!.deadline;
    let addedCoins = 0;
    if(deadline){
      addedCoins = coins(deadline, completed, task!.difficulty);
    }
    await UserCollection.updateCoins(userId, addedCoins);
    if (!task) return 0;
    task.completed = true;
    await task.save();
    return addedCoins;
  }

  static async deleteManyByParentId(id: Types.ObjectId | string) {
    return TaskModel.deleteMany({ parent: id });
  }

  /**
   * Gets all tasks for today
   */
  static async getTodayTask(userId: Types.ObjectId | string) {
    const today = new Date();
    today.setHours(0,0,0,0);
    const endOfDay = new Date();
    endOfDay.setHours(23,59,59,999);
    return TaskModel.find({ userId, deadline: { $gte: today, $lte: endOfDay}})
      .sort({deadline: "asc"})
      .populate("parent");
  }
}

export default TaskCollection;
