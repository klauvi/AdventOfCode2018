const fs = require('fs');

const start = new Date().getTime();

const getData = () => {
  const input = fs.readFileSync('./day13.txt');
  return input.toString().split('\n');
};

const input = getData();

const maxY = input[0].length;
const maxX = input.length;

const carts = {}; // 'xxx,yyy': {x, y, direction, nextTurn}
const cartExp = /[<>v\^]/g;
const board = [];

// Initialize board and carts
input.forEach((line, y) => {
  board[y] = line
    .replace(/[<>]/g, '-')
    .replace(/[v^]/g, '|')
    .split('');
  let match;
  let yPad = Array(maxY.toString().length - y.toString().length)
    .fill('0')
    .join('');
  const nextTurn = 'l';
  while ((match = cartExp.exec(line)) !== null) {
    const x = match.index;
    const direction = match[0];
    const xPad = Array(maxX.toString().length - x.toString().length)
      .fill('0')
      .join('');
    const key = `${xPad}${x},${yPad}${y}`;
    carts[key] = { x, y, direction, nextTurn };
  }
});

// helper functions and objects
const upDown = direction => direction === 'v' || direction === '^';
const turnSequence = { l: 's', s: 'r', r: 'l' };
const turnConditions = {
  '/': {
    '^': { y: 0, x: 1, direction: '>' }, // turns right - plusCondition.r -> up/down
    v: { y: 0, x: -1, direction: '<' }, // turns right - plusCondition.r -> up/down
    '<': { y: 1, x: 0, direction: 'v' }, // turns down left - plusCondition.l -> left/right
    '>': { y: -1, x: 0, direction: '^' } // turns up left - plusCondition.l -> left/right
  },
  '\\': {
    '^': { y: 0, x: -1, direction: '<' }, // turns left - plusCondition.l -> up/down
    v: { y: 0, x: 1, direction: '>' }, // turns left - plusCondition.l -> up/down
    '<': { y: -1, x: 0, direction: '^' }, // turns up right - plusCondition.r -> left/right
    '>': { y: 1, x: 0, direction: 'v' } // turns down right - plusCondition.r -> left/right
  },
  '-': {
    '<': { y: 0, x: -1, direction: '<' }, // continue left
    '>': { y: 0, x: 1, direction: '>' } // continue right
  },
  '|': {
    '^': { y: -1, x: 0, direction: '^' }, // continue up
    v: { y: 1, x: 0, direction: 'v' } // continue down
  }
};
const plusConditions = {
  s: dir => (upDown(dir) ? turnConditions['|'][dir] : turnConditions['-'][dir]),
  l: dir => (upDown(dir) ? turnConditions['\\'][dir] : turnConditions['/'][dir]),
  r: dir => (upDown(dir) ? turnConditions['/'][dir] : turnConditions['\\'][dir])
};

let answer1 = {};
let answer2 = {};
let collision = false;

while (true) {
  let change = {};
  const keys = [...Object.keys(carts).sort()];
  if (keys.length > 1) {
    keys.forEach(key => {
      if (carts[key]) {
        const cart = carts[key];
        const track = board[cart.y][cart.x];
        if (track === '+') {
          change = plusConditions[cart.nextTurn](cart.direction);
          cart.nextTurn = turnSequence[cart.nextTurn];
        } else {
          change = turnConditions[track][cart.direction];
        }
        cart.x += change.x;
        cart.y += change.y;
        cart.direction = change.direction;
        let yPad = Array(maxY.toString().length - cart.y.toString().length)
          .fill('0')
          .join('');
        const xPad = Array(maxX.toString().length - cart.x.toString().length)
          .fill('0')
          .join('');
        const newKey = `${xPad}${cart.x},${yPad}${cart.y}`;
        if (carts[newKey]) {
          if (!collision) {
            answer1.x = cart.x;
            answer1.y = cart.y;
            collision = true;
          }
          delete carts[key];
          delete carts[newKey];
        } else {
          delete carts[key];
          carts[newKey] = cart;
        }
      }
    });
  } else {
    answer2.x = carts[keys[0]].x;
    answer2.y = carts[keys[0]].y;
    break;
  }
}

console.log('Answer1:', answer1);

console.log('Answer2:', answer2);

const end = new Date().getTime();

console.log(`Finished in ${end - start}ms`);

/*
Answer1: { x: 40, y: 90 }
Answer2: { x: 65, y: 81 }
Finished in 77ms
 */
