import type { Task } from "../task/model";

// map difficulty to coin amount
const DIFFICULTY_TO_REWARD = {
  easy: 10,
  medium: 20,
  hard: 30,
} as const;

const MAX_TIME_FACTOR = 3;

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
  const timeDelta = Math.round(Math.floor((due.valueOf() - completed.valueOf()) / (1000 * 3600 * 24))) + 1;
  let onTimeFactor = 1.1 ** timeDelta;
  onTimeFactor = Math.min(onTimeFactor, MAX_TIME_FACTOR); //make sure they don't get too many coins for completing a task far out in advance
  const difficultyScale = DIFFICULTY_TO_REWARD[difficulty];
  const coins = Math.round(difficultyScale * onTimeFactor);
  return coins;
}

const MAX_HEALTH = 100;
const MIN_HEALTH = 1;
const DAILY_HEALTH_HIT = 5;

/**
 * Daily Health Algorithm
 * 
 * @param {number} currentHealth - health of duck
 * 
 * @return {number} updated health of duck
 */
 export function updateHealth(
  currentHealth: number
): number {
  //newHealth must be in range[MIN_HEALTH, MAX_HEALTH]
  const newHealth = Math.min(Math.max(currentHealth - DAILY_HEALTH_HIT, MIN_HEALTH), MAX_HEALTH);
  return Math.round(newHealth);
}

const FOOD_UNIT_VALUE = 1;

/**
 * Feeding Algorithm
 * 
 * @param {number} currentHealth - health of duck
 * @param {number} feedAmount - positive integer amount of food to give duck
 * 
 * @return {number} health of duck immediately after feeding it `feedAmount`
 */
 export function healthAfterFeed(
  currentHealth: number,
  feedAmount: number
): number {

  //newHealth must be in range[MIN_HEALTH, MAX_HEALTH]
  const newHealth = Math.min(Math.max(currentHealth + (feedAmount * FOOD_UNIT_VALUE), MIN_HEALTH), MAX_HEALTH);
  return Math.round(newHealth);
}

/**
 * User Feed Insights
 * 
 * @param {number} currentHealth - health of duck
 * 
 * @return {number} amount of food needed to fuel duck to full health
 */
 export function foodNeeded(
  currentHealth: number
): number {

  return Math.round((MAX_HEALTH - currentHealth) / FOOD_UNIT_VALUE)
}

