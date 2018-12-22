const fs = require('fs');

const start = new Date().getTime();

const erosionLevel = (map, y, x) => {
  const mulX = 16807;
  const mulY = 48271;
  const modulo = 20183;
  const depth = 11394;
  const [tX, tY] = [7, 701];
  if ((y === 0 && x === 0) || (y === tY && x === tX)) {
    return (0 + depth) % modulo;
  }
  if (y === 0) {
    return (x * mulX + depth) % modulo;
  }
  if (x === 0) {
    return (y * mulY + depth) % modulo;
  }
  if (!map[y]) {
    map[y] = [];
  }
  if (!map[y][x - 1]) {
    for (let i = 0; i < x; i++) {
      if (!map[y][i]) {
        map[y][i] = erosionLevel(map, y, i);
      }
    }
  }
  if (!map[y - 1]) {
    map[y - 1] = [];
  }
  if (!map[y - 1][x]) {
    for (let i = 0; i < y; i++) {
      if (!map[i][x]) {
        map[i][x] = erosionLevel(map, i, x);
      }
    }
  }
  return (map[y][x - 1] * map[y - 1][x] + depth) % modulo;
};

const part1 = () => {
  let target = [7, 701];
  const map = [[]];
  let answer1 = 0;
  for (let y = 0; y <= target[1]; y++) {
    map[y] = [];
    for (let x = 0; x <= target[0]; x++) {
      map[y][x] = erosionLevel(map, y, x);
      answer1 += map[y][x] % 3;
    }
  }
  console.log('Answer1:', answer1);
};

const tools = ['CT', 'CN', 'TN'];
const getNBcost = (map, y, x, tool) => {
  if (!map[y]) {
    map[y] = [];
  }
  const erosion = map[y] && map[y][x] ? map[y][x] : erosionLevel(map, y, x);
  map[y][x] = erosion;
  const possibleTools = tools[erosion % 3];
  if (possibleTools.indexOf(tool) !== -1) {
    return [1, y, x, tool];
  } else {
    return [Infinity, y, x, tool];
  }
};
const getNeighbors = (map, [y, x, tool]) => {
  y = Number(y);
  x = Number(x);
  // Add current spot with different tool
  const neighbors = [[7, y, x, tools[erosionLevel(map, y, x) % 3].replace(tool, '')]];
  if (y > 0) {
    // add cell above with both available tools
    neighbors.push(getNBcost(map, y - 1, x, tool));
  }
  if (x > 0) {
    // add left cell with both available tools
    neighbors.push(getNBcost(map, y, x - 1, tool));
  }
  // add cell below with both available tools
  neighbors.push(getNBcost(map, y + 1, x, tool));
  // add right cell with both available tools
  neighbors.push(getNBcost(map, y, x + 1, tool));
  return neighbors;
};
const distance = ([x1, y1], [x2, y2]) => Math.abs(x1 - x2) + Math.abs(y1 - y2);
const shortestPath = (map, start, goal) => {
  let currentTool = 'T';
  const startString = start.join(',') + ',' + currentTool;
  const goalString = goal.join(',') + ',' + currentTool;
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
    if (current === goalString) {
      const path = [current];
      const distance = gScore[current];
      while (cameFrom[current]) {
        current = cameFrom[current];
        path.push(current);
      }
      return [path, distance];
    }
    openSet.delete(current);
    closedSet.add(current);
    // @ts-ignore
    const neighbors = getNeighbors(map, current.split(','));
    for (let [cost, ...point] of neighbors) {
      if (cost === Infinity) {
        continue;
      }
      const nbString = point.join(',');
      if (!closedSet.has(nbString)) {
        const tentative_gScore = gScore[current] + cost;
        if (!openSet.has(nbString)) {
          openSet.add(nbString);
          fScore[nbString] = Infinity;
        }
        if (tentative_gScore >= gScore[nbString]) {
          continue;
        }
        cameFrom[nbString] = current;
        gScore[nbString] = tentative_gScore;
        fScore[nbString] = gScore[nbString] + distance([point[0], point[1]], goal);
      }
    }
  }
  return [false, 0];
};

const part2 = () => {
  const map = [[]];
  const [path, distance] = shortestPath(map, [0, 0], [701, 7]);
  console.log('Answer2:', distance);
};

part1();
const int = new Date().getTime();
part2();
const end = new Date().getTime();

console.log(`Finished in ${end - start}ms`);
console.log(`First part in ${int - start}ms`);
console.log(`Second part in ${end - int}ms`);

/*
Answer1: 5637
Answer2: 969
Finished in 13108ms
First part in 8ms
Second part in 13100ms
 */
