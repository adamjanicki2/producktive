






/**
 * Coin Algorithm
 * 
 * @param {Date} due - date task due
 * @param {Date} completed - date task completed
 * @param {string} difficulty - "easy" | "medium" | "hard" task difficulty
 * 
 * @return {number} - The coins the user earned based on difficulty and completion relative to due date
 */
function coins(due: Date, completed: Date, difficulty: string) {
    const base = (difficulty == 'hard')? 30: (difficulty == 'medium')? 20: (difficulty == 'easy')? 10: 0;
     
    const diff = due.valueOf() - completed.valueOf();
    const diffDays = Math.ceil(diff / (1000 * 3600 * 24)); 
    const punctuality = 1.1**diffDays;
    
    const coins = Math.round(base * punctuality);
    return coins;
}


const completed = new Date('2022-12-20');
const due = new Date('2022-12-23');

console.log(`hard: ${coins(due, completed, 'hard')}`);
console.log(`medium: ${coins(due, completed, 'medium')}`);
console.log(`easy: ${coins(due, completed, 'easy')}`);





