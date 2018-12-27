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

const distance = (point1, point2) =>
  Math.abs(point1[0] - point2[0]) +
  Math.abs(point1[1] - point2[1]) +
  Math.abs(point1[2] - point2[2]) +
  Math.abs(point1[3] - point2[3]);

const findConstellation = (input, groups, point1, constellation) => {
  for (let line of input) {
    if (!groups[line]) {
      const point2 = line.match(/[-]*\d+/g).map(Number);
      if (distance(point1, point2) <= 3) {
        groups[line] = constellation;
        findConstellation(input, groups, point2, constellation);
      }
    }
  }
};

const part1 = () => {
  // insert part1 here
  const [input] = init();
  const groups = {};
  let constellations = 0;
  for (let line of input) {
    if (!groups[line]) {
      groups[line] = ++constellations;
      const point1 = line.match(/[-]*\d+/g).map(Number);
      findConstellation(input, groups, point1, constellations);
    }
  }
  console.log('Answer1:', constellations);
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
