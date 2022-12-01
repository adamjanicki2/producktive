import type { Task } from "../task/model";

// map difficulty to coin amount
const DIFFICULTY_TO_REWARD = {
  easy: 10,
  medium: 20,
  hard: 30,
} as const;

/**
 * Coin Algorithm
 *
 * @param {Date} due - date task due
 * @param {Date} completed - date task completed
 * @param {Task["difficulty"]} difficulty - "easy" | "medium" | "hard" task difficulty
 *
 * @return {number} - The coins the user earned based on difficulty and completion relative to due date
 */
export function coins(
  due: Date,
  completed: Date,
  difficulty: Task["difficulty"]
): number {
  // time difference in days
  // negative if completed late
  const timeDelta = (due.valueOf() - completed.valueOf()) / (1000 * 3600 * 24);
  const onTimeFactor = 1.1 ** timeDelta;
  const difficultyScale = DIFFICULTY_TO_REWARD[difficulty];
  const coins = Math.round(difficultyScale * onTimeFactor);
  return coins;
}
