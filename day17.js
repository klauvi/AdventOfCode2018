const fs = require('fs');

const start = new Date().getTime();

const init = () => {
  const getData = () => {
    // const input = fs.readFileSync('./day17.txt');
    const input = fs.readFileSync('./test.txt');
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
      return [true, x];
    } else if (map[y][x] === '.' && map[y + 1][x] === '.') {
      map[y][x] = '|';
      map[y + 1][x] = '|';
      return [false, x];
    } else {
      map[y][x] = '|';
      x += increment;
    }
  }
};

const part1 = () => {
  const [map] = init();
  const currentX = new Set([500]);
  let y = 0;
  while (currentX.size > 0) {
    let stuck = false;
    const x = currentX.values().next().value;
    currentX.delete(x);
    const next = map[y + 1][x];
    if (next === '.') {
      map[y + 1][x] = '|';
      currentX.add(x);
      if (currentX.size === 1) {
        y++;
        continue;
      }
    } else if (map[y][x] !== '~' && (next === '#' || next === '~')) {
      const [leftwall, leftX] = fillSide(map, x - 1, y, -1);
      const [rightwall, rightX] = fillSide(map, x + 1, y, 1);
      if (!leftwall) {
        currentX.add(leftX);
      }
      if (!rightwall) {
        currentX.add(rightX);
      }
      if (leftwall && rightwall) {
        currentX.add(x);
        for (let fillX = leftX + 1; fillX < rightX; fillX++) {
          if (map[y][fillX] === '|') {
            map[y][fillX] = '~';
          }
        }
      }
    } else {
      currentX.add(x);
    }
    currentX.forEach(x => {
      if (map[y + 1][x] === '.') {
        map[y + 1][x] = '|';
        currentX.add(x);
        stuck = true;
      } else if (map[y + 1][x] !== '|') {
        stuck = true;
      }
    });
    stuck ? --y : ++y;
    if (y > map.length - 2) {
      break;
    }
  }
  // for (let line of map) console.log(line.join(''));
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
