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
  const timeDelta = Math.round(Math.floor((due.valueOf() - completed.valueOf()) / (1000 * 3600 * 24)));
  const onTimeFactor = 1.1 ** timeDelta;
  const difficultyScale = DIFFICULTY_TO_REWARD[difficulty];
  const coins = Math.round(difficultyScale * onTimeFactor);
  return coins;
}

const MAX_HEALTH = 100;
const MIN_HEALTH = 1;
const DAILY_HEALTH_HIT = 5;

/**
 * Health Algorithm
 * 
 * @param {Date} lastFeed - date most recent feed
 * @param {number} healthAfterLastFeed - health of duck immediately after the last feed
 * 
 * @return {number} current health of duck
 */
 export function health(
  lastFeed: Date, //don't need because running every day
  healthAfterLastFeed: number ///todo change name
): number {
  const today = new Date();
  // time difference in days
  const timeDelta = Math.round(Math.floor((today.valueOf() - lastFeed.valueOf()) / (1000 * 3600 * 24)));

  //currentHealth must be in range[1, 100]
  const currentHealth = Math.min(Math.max(healthAfterLastFeed - (timeDelta * DAILY_HEALTH_HIT), MIN_HEALTH), MAX_HEALTH);
  return Math.round(currentHealth);
}

const FOOD_UNIT_VALUE = 1;

/**
 * Feeding Algorithm
 * 
 * @param {Date} lastFeed - date most recent feed
 * @param {number} healthAfterLastFeed - health of duck immediately after the last feed
 * @param {number} feedAmount - positive integer amount of food to give duck
 * 
 * @return {number} health of duck immediately after feeding it `feedAmount`
 */
 export function feed(
  lastFeed: Date,
  healthAfterLastFeed: number,
  feedAmount: number
): number {
  const currentHealth = health(lastFeed, healthAfterLastFeed); //todo pass into function

  //newHealth must be in range[1, 100]
  const newHealth = Math.min(Math.max(currentHealth + (feedAmount * FOOD_UNIT_VALUE), MIN_HEALTH), MAX_HEALTH);
  return Math.round(newHealth);
}

/**
 * User Feed Insights
 * 
 * @param {Date} lastFeed - date most recent feed
 * @param {number} healthAfterLastFeed - health of duck immediately after the last feed
 * 
 * @return {number} amount of food needed to fuel duck to full health
 */
 export function foodNeeded(
  lastFeed: Date,
  healthAfterLastFeed: number
): number {
  const currentHealth = health(lastFeed, healthAfterLastFeed);

  return Math.round((MAX_HEALTH - currentHealth) / FOOD_UNIT_VALUE)
}

