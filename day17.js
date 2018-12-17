const fs = require('fs');

const start = new Date().getTime();

const init = () => {
  const getData = () => {
    const input = fs.readFileSync('./day17.txt');
    // const input = fs.readFileSync('./test.txt');
    return input.toString().split('\n');
  };

  const input = getData();
  let minY = Infinity;
  let maxY = 0;
  let minX = Infinity;
  let maxX = 0;
  const map = [[]];
  map[0][500] = '+';
  for (let line of input) {
    if (line[0] === 'x') {
      const [x, fromY, toY] = line.match(/\d+/g).map(Number);
      [minX, maxX, minY, maxY] = updateMinMax(minX, maxX, minY, maxY, x, x, fromY, toY);
      for (let y = fromY; y <= toY; y++) {
        if (map[y]) {
          map[y][x] = '#';
        } else {
          map[y] = [];
          map[y][x] = '#';
        }
      }
    } else if (line[0] === 'y') {
      const [y, fromX, toX] = line.match(/\d+/g);
      [minX, maxX, minY, maxY] = updateMinMax(minX, maxX, minY, maxY, fromX, toX, y, y);
      if (!map[y]) {
        map[y] = [];
      }
      for (let x = fromX; x <= toX; x++) {
        map[y][x] = '#';
      }
    }
  }
  for (let y = 0; y <= maxY; y++) {
    if (!map[y]) {
      map[y] = [];
    }
    for (let x = minX - 1; x <= maxX; x++) {
      if (!map[y][x]) {
        map[y][x] = '.';
      }
    }
  }
  return [map];
};

const updateMinMax = (minX, maxX, minY, maxY, fromX, toX, fromY, toY) => {
  minX = fromX < minX ? fromX : minX;
  maxX = toX > maxX ? toX : maxX;
  minY = fromY < minY ? fromY : minY;
  maxY = toY > maxY ? toY : maxY;
  return [minX, maxX, minY, maxY];
};

const part1 = () => {
  const [map] = init();

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
