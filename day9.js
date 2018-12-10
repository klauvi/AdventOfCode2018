const start = new Date().getTime();

let players = 410;
let maxMarble = 72059;

let currentIndex = 1;
let currentMarble = 1;
let currentPlayer = 1;
const marbles = [0];
let score = {};

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

const getAnswer = () =>
  Object.keys(score).reduce(
    (acc, player) => {
      if (score[player] > acc.score) {
        acc = { score: score[player], player };
      }
      return acc;
    },
    { player: '', score: 0 }
  );

console.log('Answer1:', getAnswer());

const int = new Date().getTime();

const List = function(data, prev = null, next = null) {
  this.data = data;
  this.prev = prev;
  this.next = next;
  if (prev) {
    prev.next = this;
  }
  if (next) {
    next.prev = this;
  }
};
List.prototype.delete = function() {
  this.prev.next = this.next;
  this.next.prev = this.prev;
  return this.next;
};

maxMarble *= 100;

let head = new List(0);
let current = new List(1, head, head);

currentMarble = 2;
currentPlayer = 2;
score = {};

while (currentMarble <= maxMarble) {
  if (currentMarble % 23 === 0) {
    let total = currentMarble++;
    for (let i = 0; i < 7; i++) {
      current = current.prev;
    }
    total += current.data;
    current = current.delete();
    score[currentPlayer] ? (score[currentPlayer] += total) : (score[currentPlayer] = total);
  } else {
    current = current.next;
    current = current.next;
    current = new List(currentMarble++, current.prev, current);
  }
  if (++currentPlayer > players) {
    currentPlayer = 1;
  }
}

console.log('Answer2:', getAnswer());

const end = new Date().getTime();

console.log(`Finished in ${end - start}ms`);
console.log(`First part in ${int - start}ms`);
console.log(`Second part in ${end - int}ms`);

/*
Answer1: { score: 429287, player: '370' }
Answer2: { score: 3624387659, player: '215' }
Finished in 1432ms
First part in 128ms
Second part in 1304ms
 */
