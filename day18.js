const fs = require('fs');

const start = new Date().getTime();

const init = () => {
  const getData = () => {
    const input = fs.readFileSync('./day18.txt');
    // const input = fs.readFileSync('./test.txt');
    return input.toString().split('\n');
  };

  const input = getData();
  const map = [];
  for (let y = 0; y < input.length; y++) {
    map[y] = input[y].split('');
  }
  return [map];
};

const getCell = (map, x, y) => (map[y] ? map[y][x] : undefined);
const getNeighbors = (map, x, y) => {
  const neighbors = [];
  for (let i = y - 1; i <= y + 1; i++) {
    for (let j = x - 1; j <= x + 1; j++) {
      if (i !== y || j !== x) {
        neighbors.push(getCell(map, j, i));
      }
    }
  }
  return neighbors;
};

const changes = {
  '.': (map, x, y) => {
    const nb = getNeighbors(map, x, y)
      .join('')
      .match(/\|/g);
    return nb && nb.length >= 3 ? '|' : '.';
  },
  '|': (map, x, y) => {
    const nb = getNeighbors(map, x, y)
      .join('')
      .match(/#/g);
    return nb && nb.length >= 3 ? '#' : '|';
  },
  '#': (map, x, y) => {
    const nb = getNeighbors(map, x, y).join('');
    const yard = nb.match(/#/g);
    const tree = nb.match(/\|/g);
    return yard && yard.length >= 1 && tree && tree.length >= 1 ? '#' : '.';
  }
};

const change = map => {
  const newMap = [];
  for (let y = 0; y < map.length; y++) {
    newMap[y] = [];
    for (let x = 0; x < map[y].length; x++) {
      newMap[y][x] = changes[map[y][x]](map, x, y);
    }
  }
  return newMap;
};
const getTotal = map => {
  let yard = 0;
  let tree = 0;
  for (let line of map) {
    const yards = line.join('').match(/#/g);
    const trees = line.join('').match(/\|/g);
    yard += yards ? yards.length : 0;
    tree += trees ? trees.length : 0;
  }
  return yard * tree;
};

const part1 = () => {
  let [map] = init();
  for (let time = 0; time < 10; time++) {
    const newMap = change(map);
    map = newMap;
  }
  console.log('Answer1:', getTotal(map));
};

const part2 = () => {
  let [map] = init();
  const TARGET = 1000000000;
  const pattern = {};
  const calculator = {};
  let stopper = 0;
  let patternFound = false;
  let oldTotal = getTotal(map);
  let oldTime = 0;
  for (let time = 0; time < 600; time++) {
    const newMap = change(map);
    const newTotal = getTotal(newMap);
    if (patternFound && newTotal === stopper) {
      break;
    }
    if (pattern[oldTotal] === newTotal) {
      if (!patternFound && oldTime === time - 1) {
        patternFound = true;
        stopper = newTotal;
      }
      if (patternFound) {
        calculator[time] = oldTotal;
      }
      oldTime = time;
    } else {
      pattern[oldTotal] = newTotal;
    }
    oldTotal = newTotal;
    map = newMap;
  }
  const answer2 = Object.keys(calculator)
    .map(Number)
    .reduce((acc, key) => {
      if ((TARGET - key) % Object.keys(calculator).length === 0) {
        acc = calculator[key];
      }
      return acc;
    }, 0);
  console.log('Answer2:', answer2);
};

part1();
const int = new Date().getTime();
part2();
const end = new Date().getTime();

console.log(`Finished in ${end - start}ms`);
console.log(`First part in ${int - start}ms`);
console.log(`Second part in ${end - int}ms`);

/*
Answer1: 663502
Answer2: 201341
Finished in 1193ms
First part in 39ms
Second part in 1154ms
 */
