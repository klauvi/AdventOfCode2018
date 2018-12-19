// @ts-nocheck
/*
A* shortest path function -> https://en.wikipedia.org/wiki/A*_search_algorithm
*/
const fs = require('fs');

const start = new Date().getTime();

let maxY;
let maxX;

const init = () => {
  const getData = () => {
    const input = fs.readFileSync('./test.txt');
    // const input = fs.readFileSync('./day15.txt');
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
    let match;
    while ((match = regExp.exec(input[y])) !== null) {
      const x = match.index;
      const object = new Entity(match[0], x, y);
      match[0] === 'G' ? goblins.push(object) : elves.push(object);
      map[y][x] = object;
    }
  }
  return [map, elves, goblins];
};

const Entity = function(type, x, y) {
  this.type = type;
  this.enemy = type === 'G' ? 'E' : 'G';
  this.x = x;
  this.y = y;
  this.hp = 200;
};
Entity.prototype.toString = function() {
  return this.type;
};
Entity.prototype.turn = function(map) {
  // check if enemy is in next hop and attack if there is
  const enemy = getNextHop(map, this.x, this.y).find(
    value => value && value.toString() === this.enemy
  );
  if (enemy) {
    enemy.hp -= 3;
    return true;
  } else {
    // No enemy, check if we can move
    let going = [0, 0];
    let shortest = Infinity;
    getNeighbors(map, [this.x, this.y]).forEach(from => {
      const [closest, distance] = getClosest(map, this.enemy, from);
      if (distance < shortest) {
        going = closest;
        shortest = distance;
      }
    });
    if (shortest < Infinity) {
      // There is an open path to an enemy, let's move
      map[going[1]][going[0]] = this;
      map[this.y][this.x] = '.';
      [this.x, this.y] = going;
      // now we need to check again if there is enemy close and attack if there is
      if (shortest === 1) {
        // There should be enemy next
        const enemy = getNextHop(map, this.x, this.y).find(
          value => value && value.toString() === this.enemy
        );
        if (enemy) {
          enemy.hp -= 3;
          return true;
        } else {
          console.log('Someone is lying', this);
        }
      } else {
        // there shouldnt be enemy close enough, but still check
        const enemy = getNextHop(map, this.x, this.y).find(
          value => value && value.toString() === this.enemy
        );
        if (enemy) {
          enemy.hp -= 3;
          console.log('Someone is lying again', this);
        }
        return true;
      }
    } else {
      // nowhere to go, do nothing
      return false;
    }
  }
};

const getClosest = (map, target, from) => {
  let closest = from;
  let distance = Infinity;
  for (let y = 0; y < maxY; y++) {
    for (let x = 0; x < maxX; x++) {
      if (map[y][x].toString() === target) {
        getNeighbors(map, [x, y]).forEach((goal, index, array) => {
          if (from.join('') === goal.join('')) {
            // can't get closer than this, we can attack now
            if (distance > 1) {
              closest = from;
              distance = 1;
            }
          }
          const path = reachable(map, from, goal);
          if (path && path.length < distance) {
            closest = from;
            distance = path.length;
          }
        });
      }
    }
  }
  return [closest, distance];
};

const getNextHop = (map, x, y) => {
  const next = [];
  if (map[y - 1]) {
    next.push(map[y - 1][x]);
  }
  next.push(map[y][x - 1]);
  next.push(map[y][x + 1]);
  if (map[y + 1]) {
    next.push(map[y + 1][x]);
  }
  return next;
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
  return false;
};

const part1 = () => {
  const [map, elves, goblins] = init();
  // const path = reachable(map, [8, 16], [23, 13]);
  const elf = map[2][4];
  const goblin = map[1][3];
  console.log(goblin.turn(map));
  console.log(goblin);
  // for (let line of map) {
  //   console.log(line.join(''));
  // }
  console.log('Answer1:', elf);
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
