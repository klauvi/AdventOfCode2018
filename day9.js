const start = new Date().getTime();

const players = 410;
const maxMarble = 72059;

let currentIndex = 1;
let currentMarble = 1;
let currentPlayer = 1;
const marbles = [0];
const score = {};

while (currentMarble <= maxMarble) {
  if (currentMarble % 23 === 0) {
    let total = currentMarble++;
    currentIndex = currentIndex > 7 ? currentIndex - 7 : marbles.length - (7 - currentIndex);
    total += marbles.splice(currentIndex, 1)[0];
    score[currentPlayer] ? (score[currentPlayer] += total) : (score[currentPlayer] = total);
  } else {
    currentIndex += 2;
    if (currentIndex > marbles.length) {
      currentIndex = 1;
    }
    marbles.splice(currentIndex, 0, currentMarble++);
  }
  if (++currentPlayer > players) {
    currentPlayer = 1;
  }
}

const answer1 = Object.keys(score).reduce(
  (acc, player) => {
    if (score[player] > acc.score) {
      acc = { score: score[player], player };
    }
    return acc;
  },
  { player: '', score: 0 }
);

console.log('Answer1:', answer1);

const int = new Date().getTime();

// insert part2 here, remember to refactor part1 to help with part2 solution 😊

console.log('Answer2:');

const end = new Date().getTime();

console.log(`Finished in ${end - start}ms`);
console.log(`First part in ${int - start}ms`);
console.log(`Second part in ${end - int}ms`);

/*
 */
