// @ts-nocheck
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
      const [y, fromX, toX] = line.match(/\d+/g).map(Number);
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
  return [map, minX, maxX];
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
    } else if ((map[y][x] === '.' || map[y][x] === '|') && map[y + 1][x] === '.') {
      map[y][x] = '|';
      return [false, x];
    } else {
      map[y][x] = '|';
      x += increment;
    }
  }
};

const Stream = function(x, y) {
  this.x = x;
  this.y = y;
};

const part1 = () => {
  const [map] = init();
  const returnMap = [];
  const finished = {};
  for (let y = 0; y < map.length; y++) {
    returnMap[y] = map[y].slice();
  }
  const streams = new Set();
  let current = new Stream(500, 0);
  streams.add(current);
  while (streams.size > 0) {
    const currentMap = [];
    for (let y = 0; y < map.length; y++) {
      currentMap[y] = map[y].slice();
    }
    current = streams.values().next().value;
    streams.delete(current);
    let y = current.y;
    let x = current.x;
    if (finished[`${x},${y}`]) {
      continue;
    }
    while (true) {
      if (y >= map.length - 1) {
        finished[`${current.x},${current.y}`] = true;
        break;
      }
      const next = currentMap[y + 1][x];
      if (next === '.') {
        currentMap[++y][x] = '|';
        returnMap[y][x] = '|';
        continue;
      }
      if (next === '#' && currentMap[y + 1][x - 1] !== '#' && currentMap[y + 1][x + 1] !== '#') {
        // hit the edge of a pool, need to spread both ways
        if ('#~'.indexOf(currentMap[y][x + 1]) === -1) {
          currentMap[y][x + 1] = '|';
          returnMap[y][x + 1] = '|';
          streams.add(new Stream(x + 1, y));
        }
        if ('#~'.indexOf(currentMap[y][x - 1]) === -1) {
          currentMap[y][--x] = '|';
          returnMap[y][x] = '|';
          continue;
        } else {
          console.log('something weird happended while spreading at', x, y, current);
          break;
        }
      }
      if (next === '#' || next === '~') {
        const [leftwall, leftX] = fillSide(currentMap, x - 1, y, -1);
        const [rightwall, rightX] = fillSide(currentMap, x + 1, y, 1);
        for (let fillX = leftX + 1; fillX < rightX; fillX++) {
          returnMap[y][fillX] = '|';
        }
        if (!leftwall) {
          x = leftX;
          currentMap[y][x] = '|';
          returnMap[y][x] = '|';
        }
        if (!rightwall && !leftwall) {
          streams.add(new Stream(rightX, y));
          returnMap[y][rightX] = '|';
        } else if (!rightwall && leftwall) {
          x = rightX;
          currentMap[y][x] = '|';
          returnMap[y][x] = '|';
        }
        if (rightwall && leftwall) {
          for (let fillX = leftX + 1; fillX < rightX; fillX++) {
            if (currentMap[y][fillX] === '|') {
              currentMap[y][fillX] = '~';
              returnMap[y][fillX] = '~';
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
  // for (let line of returnMap)
  //   fs.appendFileSync('./day17.final.txt', line.join('').replace('.', ' ') + '\n');
  const [answer1, answer2] = returnMap.reduce(
    ([a1, a2], line) => {
      const water = line.join('').match(/[~|]/g);
      const still = line.join('').match(/[~]/g);
      a1 += water ? water.length : 0;
      a2 += still ? still.length : 0;
      return [a1, a2];
    },
    [0, 0]
  );
  console.log('Answer1:', answer1);
  console.log('Answer2:', answer2);
};

part1();

const end = new Date().getTime();

console.log(`Finished in ${end - start}ms`);

/*
Answer1: 33008  // should be 33004 because top 4 are above first clay line
Answer2: 23294
Finished in 1744ms
 */
