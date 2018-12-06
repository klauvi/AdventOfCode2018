const fs = require('fs');

const start = new Date().getTime();

const getData = () => {
  const input = fs.readFileSync('./day6.txt');
  return input.toString().split('\n');
};

const input = getData();

const findClosest = (x, y, data) => {
  let closest = '';
  Object.keys(data).reduce((acc, key) => {
    const distance = Math.abs(data[key].x - x) + Math.abs(data[key].y - y);
    if (acc > distance) {
      closest = key;
      return distance;
    } else if (acc === distance) {
      closest = '.';
    }
    return acc;
  }, Number.MAX_SAFE_INTEGER);
  return closest;
};

let grid = {};
let points = {};

const [minx, miny, maxx, maxy] = input.reduce(
  (acc, line) => {
    const [x, y] = line.split(',').map(Number);
    grid[line] = { x, y, closest: line };
    points[line] = { x, y, count: 1 };
    acc = [
      x < acc[0] ? x : acc[0],
      y < acc[1] ? y : acc[1],
      x > acc[2] ? x : acc[2],
      y > acc[3] ? y : acc[3]
    ];
    return acc;
  },
  [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, 0, 0]
);

for (let j = minx; j <= maxx; j++) {
  for (let i = miny; i <= maxy; i++) {
    const line = `${i}, ${j}`;
    if (!grid[line]) {
      const closest = findClosest(i, j, points);
      grid[line] = { x: i, y: j, closest };
      if (closest !== '.') {
        points[closest].count++;
      }
    }
  }
}

const answer1 = Object.keys(points).reduce(
  (acc, key) => (acc > points[key].count ? acc : points[key].count),
  0
);

console.log('Answer1:', answer1);

const int = new Date().getTime();

const end = new Date().getTime();

console.log(`Finished in ${end - start}ms`);
console.log(`First part in ${int - start}ms`);
console.log(`Second part in ${end - int}ms`);

/*
 */
