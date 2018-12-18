/*
A* shortest path function -> https://en.wikipedia.org/wiki/A*_search_algorithm
*/
const fs = require('fs');

const start = new Date().getTime();

let maxY;
let maxX;

const init = () => {
  const getData = () => {
    const input = fs.readFileSync('./day15.txt');
    return input.toString().split('\n');
  };

  const input = getData();

  const regExp = new RegExp(/[GE]/g);
  const map = [];
  const elves = [];
  const goblins = [];
  maxY = input.length;
  maxX = input[0].length;

  for (let y = 0; y < maxY; y++) {
    map[y] = input[y].split('');
    const hp = 200;
    let match;
    while ((match = regExp.exec(input[y])) !== null) {
      const x = match.index;
      const object = { x, y, hp };
      match[0] === 'G' ? goblins.push(object) : elves.push(object);
    }
  }
  return [map, elves, goblins];
};

const inRange = (map, target, point) => {
  const points = [];
  for (let y = 0; y < maxY; y++) {
    for (let x = 0; x < maxX; x++) {
      if (map[y][x] === target) {
        if (map[y - 1] && map[y - 1][x] === '.') {
          points.push({ x, y: y - 1 });
        }
        if (map[y][x - 1] === '.') {
          points.push({ x: x - 1, y });
        }
        if (map[y][x + 1] === '.') {
          points.push({ x: x + 1, y });
        }
        if (map[y + 1] && map[y + 1][x] === '.') {
          points.push({ x, y: y + 1 });
        }
      }
    }
  }
  return points;
};

/**
 *
 * @param {Number[]} param0
 * @param {Number[]} param1
 */
const distance = ([x1, y1], [x2, y2]) => Math.abs(x1 - x2) + Math.abs(y1 - y2);

/**
 *
 * @param {any} map
 * @param {Number[]} param1
 */
const getNeighbors = (map, [x, y]) => {
  const neighbors = [];
  if (y > 0) {
    if (map[y - 1][x] === '.') {
      neighbors.push([x, y - 1]);
    }
  }
  if (map[y][x - 1] === '.') {
    neighbors.push([x - 1, y]);
  }
  if (map[y][x + 1] === '.') {
    neighbors.push([x + 1, y]);
  }
  if (y < maxY - 1) {
    if (map[y + 1][x] === '.') {
      neighbors.push([x, y + 1]);
    }
  }
  return neighbors;
};

const reachable = (map, start, goal) => {
  const startString = start.join(',');
  const goalString = goal.join(',');
  const closedSet = new Set();
  const openSet = new Set();
  openSet.add(startString);
  const cameFrom = {};
  const gScore = {};
  gScore[startString] = 0;
  const fScore = {};
  fScore[startString] = distance(start, goal);
  let current = '';
  while (openSet.size > 0) {
    let shortest = Infinity;
    current = openSet.values().next().value;
    openSet.forEach(point => {
      if (fScore[point] < shortest) {
        shortest = fScore[point];
        current = point;
      }
    });
    // console.log(openSet, fScore, current);
    if (current === goalString) {
      const path = [current];
      while (cameFrom[current]) {
        current = cameFrom[current];
        path.push(current);
      }
      return path;
    }
    openSet.delete(current);
    closedSet.add(current);
    const neighbors = getNeighbors(map, current.split(',').map(Number));
    for (let point of neighbors) {
      const nbString = point.join(',');
      if (!closedSet.has(nbString)) {
        const tentative_gScore = gScore[current] + 1;
        if (!openSet.has(nbString)) {
          openSet.add(nbString);
          fScore[nbString] = Infinity;
        }
        if (tentative_gScore >= gScore[nbString]) {
          continue;
        }
        cameFrom[nbString] = current;
        gScore[nbString] = tentative_gScore;
        fScore[nbString] = gScore[nbString] + distance(point, goal);
      }
    }
  }
  return [];
};

const part1 = () => {
  const [map, elves, goblins] = init();
  const range = inRange(map, 'G', null);
  const path = reachable(map, [8, 16], [23, 13]);
  console.log('Answer1:', path.length);
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
