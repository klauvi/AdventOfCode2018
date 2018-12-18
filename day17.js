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

const fillSide = (map, x, y, increment) => {
  while (true) {
    if (map[y][x] === '#') {
      return [true, x, 0];
    } else if (map[y][x] === '.' && map[y + 1][x] === '.') {
      map[y][x] = '|';
      return [false, x, 0];
    } else if (map[y][x] === '|' && map[y + 1][x] === '|') {
      return [false, x, y];
    } else {
      map[y][x] = '|';
      x += increment;
      if (x < 480 || 600 < x) {
        console.log('i am stuck here', x, y);
        return [undefined, 0];
      }
    }
  }
};

const Stream = function(x, y) {
  this.x = x;
  this.y = y;
};

const part1 = () => {
  const [map] = init();
  const streams = new Set();
  let current = new Stream(500, 0);
  streams.add(current);
  while (streams.size > 0) {
    current = streams.values().next().value;
    streams.delete(current);
    let y = current.y;
    let x = current.x;
    if (current.x === 483 && current.y === 1278) {
      break;
    }
    while (true) {
      if (y === map.length - 1) {
        break;
      }
      const next = map[y + 1][x];
      if (next === '|') {
        break;
      }
      if (next === '.') {
        map[++y][x] = '|';
        continue;
      }
      if (next === '#' && map[y + 1][x - 1] !== '#' && map[y + 1][x + 1] !== '#') {
        if ('#~'.indexOf(map[y][x - 1]) === -1) {
          map[y][x - 1] = '|';
        }
        if ('#~'.indexOf(map[y][x + 1]) === -1) {
          map[y][x + 1] = '|';
        }
        x = x - 1;
        if (x === 559 && y === 1908) {
          console.log('found a bug');
          continue;
        }
        if (x === 531 && y === 1564) {
          console.log('found a bug');
          continue;
        }
        streams.add(new Stream(x + 1, y));
        continue;
      }
      if (next === '#' || next === '~') {
        const [leftwall, leftX, debugleft] = fillSide(map, x - 1, y, -1);
        const [rightwall, rightX, debugright] = fillSide(map, x + 1, y, 1);
        if (leftwall === false) {
          x = leftX;
        }
        if (rightwall === false && leftwall === false) {
          streams.add(new Stream(rightX, y));
        } else if (rightwall === false && leftwall === true) {
          x = rightX;
        }
        if (rightwall === true && leftwall === true) {
          for (let fillX = leftX + 1; fillX < rightX; fillX++) {
            if (map[y][fillX] === '|') {
              map[y][fillX] = '~';
            }
          }
          --y;
          continue;
        } else {
          continue;
        }
      }
    }
  }
  // for (let line of map)
  //   fs.appendFileSync('./day17.final.txt', line.join('').replace('.', ' ') + '\n');
  console.log(
    'Answer1:',
    map.reduce((acc, line) => {
      const water = line.join('').match(/[~|]/g);
      if (water) {
        acc += water.length;
      }
      return acc;
    }, 0)
  );
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
