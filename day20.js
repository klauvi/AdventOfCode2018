const fs = require('fs');

const start = new Date().getTime();

const init = () => {
  const getData = () => {
    // const input = fs.readFileSync('./day20.txt');
    const input = fs.readFileSync('./test.txt');
    return input.toString().split('\n');
  };

  const input = getData();
  return [input];
};

const Tree = function(string, start, parent = null) {
  this.string = string;
  this.start = start;
  this.end = start;
  this.parent = parent;
  this.children = [];
};
Tree.prototype.addChild = function(child) {
  this.children.push(child);
};
Tree.prototype.isRoot = function() {
  return this.parent === null;
};
Tree.prototype.walk = function(map) {
  this.end = walk(this.string, map, this.start);
};
Tree.prototype.getValue = function() {
  const value = palindrome(this.string) ? this.string.length / 2 : this.string.length;
  return this.children.length === 0
    ? value
    : this.children.reduce((acc, child) => (acc += child.getValue()), value);
};
// object for reverse check
const r = { N: 'S', E: 'W', W: 'E', S: 'N' };
const palindrome = string => {
  return string.length % 2 !== 0
    ? false
    : string
        .split('')
        .reverse()
        .every((char, i) => string[i] === r[char]);
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
  console.log(minX, maxX, minY, maxY);
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
      fs.appendFileSync('./day20.debug.map.log', line.replace(/\?/g, '#') + '\n');
    } else {
      console.log(line.replace(/\?/g, '#'));
    }
  }
};

const part1 = () => {
  const [input] = init()[0];
  // initialize map
  const map = [];
  let y = 0;
  let x = 0;
  addRoom(map, [y, x]);
  map[y][x] = 'X';
  // get first steps and initialize root
  let i = 1;
  let next = nextOperatorIndex(input, i);
  let string = input.slice(i, next);
  const root = new Tree(string, [y, x]);
  root.walk(map);
  let current = root;
  while (true) {
    [y, x] = current.end;
    i = next + 1;
    next = nextOperatorIndex(input, i);
    let nextOp = input[next];
    string = input.slice(i, next);
    let child = new Tree(string, [y, x], current);
    if (string.length > 0) {
      // let's walk if we have a string
      child.walk(map);
      current.addChild(child);
    }
    if (nextOp === '(') {
      // set child as current, crawling tree
      current = child;
    }
    if (nextOp === '|') {
      // don't do anything? unless next op there after is )
      if (input[next + 1] === ')' && palindrome(string)) {
        // doing some funky stuff if it's a palindrome
        i = next + 2;
        next = nextOperatorIndex(input, i);
        nextOp = input[next];
        string = input.slice(i, next);
        if (string.length > 0) {
          child = new Tree(string, [y, x], current);
          child.walk(map);
          current.addChild(child);
        }
        if (nextOp === '|') {
          current = current.parent;
        }
        // need more funky stuff here, maybe recursion
      }
    }
    if (nextOp === ')') {
      // current done, go to parent
      current = current.parent;
      if (current.isRoot()) {
        break;
      }
    }
  }
  printMap(map);
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
