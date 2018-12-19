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
    // const input = fs.readFileSync('./test.txt');
    const input = fs.readFileSync('./day15.txt');
    return input.toString().split('\n');
  };

  const input = getData();

  const regExp = new RegExp(/[GE]/g);
  const map = [];
  const elves = new Set();
  const goblins = new Set();
  maxY = input.length;
  maxX = input[0].length;

  for (let y = 0; y < maxY; y++) {
    map[y] = input[y].split('');
    let match;
    while ((match = regExp.exec(input[y])) !== null) {
      const x = match.index;
      const object = new Entity(match[0], x, y);
      match[0] === 'G' ? goblins.add(object) : elves.add(object);
      map[y][x] = object;
    }
  }
  return [map, elves, goblins];
};

const Entity = function(type, x, y) {
  this.type = type;
  this.enemy = type === 'G' ? 'E' : 'G';
  this.ap = type === 'G' ? 3 : parseInt(process.argv[2]) || 3;
  this.x = x;
  this.y = y;
  this.hp = 200;
};
Entity.prototype.toString = function() {
  return this.type;
};
Entity.prototype.turn = function(map) {
  // check if enemy is in next hop and attack if there is
  const enemies = getNextHop(map, this.x, this.y).filter(
    value => value && value.toString() === this.enemy
  );
  if (enemies.length > 0) {
    const enemy = enemies.reduce((acc, val) => (val.hp < acc.hp ? val : acc), enemies[0]);
    enemy.hp -= this.ap;
    return enemy;
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
        const enemies = getNextHop(map, this.x, this.y).filter(
          value => value && value.toString() === this.enemy
        );
        if (enemies.length > 0) {
          const enemy = enemies.reduce((acc, val) => (val.hp < acc.hp ? val : acc), enemies[0]);
          enemy.hp -= this.ap;
          return enemy;
        } else {
          console.log('Someone is lying', this);
        }
      } else {
        // there shouldnt be enemy close enough, but still check
        const enemies = getNextHop(map, this.x, this.y).filter(
          value => value && value.toString() === this.enemy
        );
        if (enemies.length > 0) {
          const enemy = enemies.reduce((acc, val) => (val.hp < acc.hp ? val : acc), enemies[0]);
          enemy.hp -= this.ap;
          return enemy;
        }
        return false;
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

const part2 = () => {
  const [map, elves, goblins] = init();
  const regExp = new RegExp(/[GE]/, 'g');
  let round = 0;
  while (elves.size > 0 && goblins.size > 0) {
    const working = [];
    for (let line of map) {
      while ((match = regExp.exec(line.join('')))) {
        working.push(line[match.index]);
      }
    }
    working.forEach(entity => {
      if (entity.hp > 0) {
        const attacked = entity.turn(map);
        if (attacked && attacked.hp <= 0) {
          attacked.type === 'G' ? goblins.delete(attacked) : elves.delete(attacked);
          map[attacked.y][attacked.x] = '.';
        }
      }
    });
    if (elves.size > 0 && goblins.size > 0) {
      ++round;
    }
  }
  let answer = 0;
  goblins.forEach(goblin => (answer += goblin.hp));
  elves.forEach(elf => (answer += elf.hp));
  console.log('Answer:', answer * round);
};

part2();
const end = new Date().getTime();

console.log(`Finished in ${end - start}ms`);

/*
Answer1: 179968
First part in 7827ms
Answer2: 42656 -- this is wrong, don't know why
Second part in 6153ms
 */
