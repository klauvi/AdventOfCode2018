const fs = require('fs');

const start = new Date().getTime();

const init = () => {
  const getData = () => {
    const input = fs.readFileSync('./day20.txt');
    // const input = fs.readFileSync('./test.txt');
    return input.toString().split('\n');
  };

  const input = getData();
  return [input];
};

const addRoom = (map, [y, x]) => {
  if (!map[y]) {
    map[y] = [];
  }
  map[y][x] = '.';
  addCorners(map, [y, x]);
  fillDoors(map, [y, x]);
};
const addCorners = (map, [y, x]) => {
  if (!map[y - 1]) {
    map[y - 1] = [];
  }
  if (!map[y + 1]) {
    map[y + 1] = [];
  }
  map[y - 1][x - 1] = map[y - 1][x + 1] = '#';
  map[y + 1][x - 1] = map[y + 1][x + 1] = '#';
};
const fillDoors = (map, [y, x]) => {
  if ('-|'.indexOf(map[y - 1][x]) === -1) {
    map[y - 1][x] = '?';
  }
  if ('-|'.indexOf(map[y + 1][x]) === -1) {
    map[y + 1][x] = '?';
  }
  if ('-|'.indexOf(map[y][x - 1]) === -1) {
    map[y][x - 1] = '?';
  }
  if ('-|'.indexOf(map[y][x + 1]) === -1) {
    map[y][x + 1] = '?';
  }
};
const go = {
  E: (map, [y, x]) => {
    x += 2;
    addRoom(map, [y, x]);
    map[y][x - 1] = '|';
    return [y, x];
  },
  N: (map, [y, x]) => {
    y -= 2;
    addRoom(map, [y, x]);
    map[y + 1][x] = '-';
    return [y, x];
  },
  S: (map, [y, x]) => {
    y += 2;
    addRoom(map, [y, x]);
    map[y - 1][x] = '-';
    return [y, x];
  },
  W: (map, [y, x]) => {
    x -= 2;
    addRoom(map, [y, x]);
    map[y][x + 1] = '|';
    return [y, x];
  }
};
const walk = (string, map, [y, x]) => {
  string.split('').forEach(char => {
    [y, x] = go[char](map, [y, x]);
  });
  return [y, x];
};
const nextOperatorIndex = (string, i) => {
  const nextStart = [string.indexOf('(', i)].map(v => (v === -1 ? Infinity : v))[0];
  const nextEnd = [string.indexOf(')', i)].map(v => (v === -1 ? Infinity : v))[0];
  const nextOr = [string.indexOf('|', i)].map(v => (v === -1 ? Infinity : v))[0];
  return Math.min(nextStart, nextEnd, nextOr);
};
const printMap = (map, file = false) => {
  const minY = Math.min.apply(Math, Object.keys(map));
  const maxY = Math.max.apply(Math, Object.keys(map));
  let minX = Infinity;
  let maxX = -Infinity;
  for (let y = minY; y <= maxY; y++) {
    const lowX = Math.min.apply(Math, Object.keys(map[y]));
    const highX = Math.max.apply(Math, Object.keys(map[y]));
    minX = lowX < minX ? lowX : minX;
    maxX = highX > maxX ? highX : maxX;
  }
  for (let y = minY; y <= maxY; y++) {
    if (!map[y]) {
      console.log(y, 'is not in map');
      continue;
    }
    let line = '';
    for (let x = minX; x <= maxX; x++) {
      line += map[y][x] || '%';
    }
    if (file) {
      fs.appendFileSync('./day20.debug.log', line.replace(/\?/g, '#') + '\n');
    } else {
      console.log(line.replace(/\?/g, '#'));
    }
  }
};

const part1 = () => {
  const [input] = init()[0];
  const map = [];
  let y = 0;
  let x = 0;
  let i = 1;
  const tracker = [];
  addRoom(map, [y, x]);
  map[y][x] = 'X';
  while (true) {
    let next = nextOperatorIndex(input, i);
    if (next === Infinity) {
      break;
    }
    const nextOp = input[next];
    const string = input.slice(i, next);
    if (string.length > 0) {
      if (nextOp === '|') {
        walk(string, map, [y, x]);
        input[i - 1] === ')' ? ([y, x] = tracker.pop()) : tracker.pop();
      } else if (nextOp === '(') {
        [y, x] = walk(string, map, [y, x]);
        tracker.push([y, x]);
      } else if (nextOp === ')') {
        [y, x] = walk(string, map, [y, x]);
      } else {
        console.log('I forgot something', string, nextOp);
      }
    } else {
      if (nextOp === '|' && tracker.length > 0) {
        [y, x] = tracker.pop();
      } else if (nextOp === '(') {
        tracker.push([y, x]);
      } else if (nextOp === '|' && tracker.length === 0) {
        console.log('FAIL', i);
      }
    }
    fs.appendFileSync(
      './day20.debug.log',
      `${i}${i < 10 ? ' ' : ''}${i < 100 ? ' ' : ''}${
        i < 1000 ? ' ' : ''
      }  ${string} ${nextOp} y:${y} x:${x} - ${tracker.join(' ; ')}\n`
    );
    // console.log(string, nextOp, y, x, i, tracker);
    i = next + 1;
  }
  // printMap(map, true);
  console.log('Answer1:');
};

const part2 = () => {
  // insert part2 here, remember to refactor part1 to help with part2 solution 😊
  console.log('Answer2:');
};

part1();
const int = new Date().getTime();
part2();
const end = new Date().getTime();

console.log(`Finished in ${end - start}ms`);
console.log(`First part in ${int - start}ms`);
console.log(`Second part in ${end - int}ms`);

/*
 */
