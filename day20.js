const fs = require('fs');

const start = new Date().getTime();

const init = () => {
  const getData = () => {
    const filename = process.argv[2] || 'test';
    const input = fs.readFileSync(`./${filename}.txt`);
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
const checkDeadEnd = (input, i) => {
  const nextClosing = input.indexOf(')', i);
  const bracket = input.slice(i, nextClosing + 1);
};
const run = (map, input, current, i) => {
  while (true) {
    if (!current) {
      console.log(current, i);
    }
    const point = current.end;
    const next = nextOperatorIndex(input, i);
    const nextOp = input[next];
    const string = input.slice(i, next);
    const child = new Tree(string, point, current);
    if (string.length > 0) {
      // let's walk if we have a string
      child.walk(map);
      current.addChild(child);
    }
    if (nextOp === '(') {
      // set child as current, crawling tree
      current = child;
    } else if (nextOp === '|') {
      // don't do anything? unless next op there after is )
      if (input[next + 1] === ')' && palindrome(string)) {
        // doing some funky stuff if it's a palindrome
        const thirdOp = input[next + 2];
        // if closing paren next goto parent
        if (thirdOp === ')') {
          current = current.parent;
        } else if (thirdOp === '(') {
          // need a new root
          i = subroutine(map, input, next + 3, current);
          continue;
        } else {
          const newnext = nextOperatorIndex(input, next + 2);
          const newnextOp = input[newnext];
          const newstring = input.slice(next + 2, newnext);
          if (newnextOp === '|' || newnextOp === ')') {
            const newChild = new Tree(newstring, point, current);
            newChild.walk(map);
            current.addChild(newChild);
            current = current.parent;
            if (newnextOp === ')') {
              current = current.parent;
            }
            i = newnext + 1;
            continue;
          } else if (newnextOp === '(') {
            i = subroutine(map, input, next + 2, current);
            continue;
          }
        }
        // if string and next operator after that is | we only need one more child
      }
    } else if (nextOp === ')') {
      // current done, go to parent, return if parent is root
      current = current.parent;
      if (current.isRoot()) {
        return [current, next + 1];
      }
    }
    i = next + 1;
  }
};
const newRoot = (input, i, start) => {
  const next = nextOperatorIndex(input, i);
  const string = input.slice(i, next);
  return new Tree(string, start);
};
const subroutine = (map, input, i, current) => {
  const root = newRoot(input, i, current.end);
  if (i > 500) {
    console.log(i, root);
  }
  root.walk(map);
  const [newChild, newIndex] = run(map, input, root, nextOperatorIndex(input, i) + 1);
  newChild.parent = current;
  current.addChild(newChild);
  current = current.parent;
  return newIndex;
};

const part1 = () => {
  const [input] = init()[0];
  // initialize map
  const map = [];
  let y = 0;
  let x = 0;
  let i = 1;
  addRoom(map, [y, x]);
  map[y][x] = 'X';
  // get first steps and initialize root
  const root = newRoot(input, i, [y, x]);
  root.walk(map);
  run(map, input, root, nextOperatorIndex(input, i) + 1);
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
