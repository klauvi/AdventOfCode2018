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
  console.log(maxY);

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

const part1 = () => {
  const [map, elves, goblins] = init();
  const range = inRange(map, 'G', null);
  console.log('Answer1:', range);
};

part1();

const int = new Date().getTime();

const part2 = () => {
  // insert part2 here, remember to refactor part1 to help with part2 solution 😊

  console.log('Answer2:');
};

part2();

const end = new Date().getTime();

console.log(`Finished in ${end - start}ms`);
console.log(`First part in ${int - start}ms`);
console.log(`Second part in ${end - int}ms`);

/*
 */
