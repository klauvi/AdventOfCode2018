const fs = require('fs');

const start = new Date().getTime();

const getData = () => {
  const input = fs.readFileSync('./day7.txt');
  return input
    .toString()
    .split('\n')
    .sort();
};

const input = getData();

let steps = [];
let letters = new Set();
let available = [];

const extractSteps = () =>
  input.reduce(
    (acc, line) => {
      const [, step, , , , , , pre] = line.split(' ');
      letters.add(step);
      letters.add(pre);
      acc[0].push(step);
      acc[1].push(pre);
      return acc;
    },
    [[], []]
  );

let [step, pre] = extractSteps();

const getAvailable = () =>
  [...letters.values()].forEach(letter => {
    if (pre.indexOf(letter) === -1) {
      available.push(letter);
      letters.delete(letter);
    }
  });

const removeStep = char => {
  let found = true;
  while (found) {
    const index = step.indexOf(char);
    if (index === -1) {
      break;
    }
    step.splice(index, 1);
    pre.splice(index, 1);
  }
};

while (letters.size > 0) {
  getAvailable();
  available.sort();
  const next = available.splice(0, 1)[0];
  steps.push(next);
  removeStep(next);
}

console.log('Answer1:', steps.join(''));

const int = new Date().getTime();

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
let done = [];
let time = 0;
const queue = {};
['w1', 'w2', 'w3', 'w4', 'w5'].forEach(worker => {
  queue[worker] = {
    working: false,
    current: '',
    timeLeft: 0
  };
});

[step, pre] = extractSteps();

const nextWorker = () => Object.keys(queue).find(key => !queue[key].working);
const performWork = () =>
  Object.keys(queue).forEach(key => {
    if (queue[key].working) {
      if (--queue[key].timeLeft === 0) {
        queue[key].working = false;
        done.push(queue[key].current);
        removeStep(queue[key].current);
      }
    }
  });

while (letters.size > 0) {
  getAvailable();
  while (available.length > 0) {
    available.sort();
    const worker = nextWorker();
    if (worker) {
      const next = available.splice(0, 1)[0];
      queue[worker].working = true;
      queue[worker].current = next;
      queue[worker].timeLeft = 61 + alphabet.indexOf(next);
    } else {
      performWork();
      time++;
    }
  }
  performWork();
  time++;
  if (letters.size === 0) {
    while (true) {
      if (Object.keys(queue).some(key => queue[key].working)) {
        performWork();
        time++;
      } else {
        break;
      }
    }
  }
}

console.log('Answer2:', time);

const end = new Date().getTime();

console.log(`Finished in ${end - start}ms`);
console.log(`First part in ${int - start}ms`);
console.log(`Second part in ${end - int}ms`);

/*
Answer1: OUGLTKDJVBRMIXSACWYPEQNHZF
Answer2: 929
Finished in 9ms
First part in 4ms
Second part in 5ms
 */
