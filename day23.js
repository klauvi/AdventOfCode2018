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

const distance = (x1, y1, z1, x2, y2, z2) => {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2) + Math.abs(z1 - z2);
};

const part1 = () => {
  // insert part1 here
  const [input] = init();
  let maxR = 0;
  let maxIndex = -1;
  for (let i = 0; i < input.length; i++) {
    const [x, y, z, r] = input[i].match(/[-]*\d+/g).map(Number);
    if (r > maxR) {
      maxR = r;
      maxIndex = i;
    }
  }
  let inRange = 0;
  const [strongX, strongY, strongZ, strongR] = input[maxIndex].match(/[-]*\d+/g).map(Number);
  for (let line of input) {
    const [x, y, z, r] = line.match(/[-]*\d+/g).map(Number);
    inRange += distance(strongX, strongY, strongZ, x, y, z) <= strongR ? 1 : 0;
  }
  console.log('Answer1:', inRange);
};

const hash = (x, y, z) => `${x},${y},${z}`;

const part2 = () => {
  // insert part2 here, remember to refactor part1 to help with part2 solution 😊
  const [input] = init();
  const points = new Map();
  for (let i = 0; i < input.length; i++) {
    const point1 = input[i]
      .split(' ')[0]
      .match(/[-]*\d+/g)
      .map(Number);
    const radius1 = input[i]
      .split(' ')[1]
      .match(/[-]*\d+/g)
      .map(Number)[0];
    const inRange = [];
    for (let line2 of input) {
      const point2 = line2
        .split(' ')[0]
        .match(/[-]*\d+/g)
        .map(Number);
      const radius2 = line2
        .split(' ')[1]
        .match(/[-]*\d+/g)
        .map(Number)[0];
      if (distance(...point1, ...point2) <= radius1 + radius2) {
        inRange.push(hash(...point2));
      }
    }
    points.set(i, inRange.length);
  }
  let radius = 0;
  let point = 0;
  points.forEach((value, key) => {
    if (radius < value) {
      radius = value;
      point = key;
    }
  });
  console.log('Answer2:', radius, point);
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
