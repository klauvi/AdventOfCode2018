const fs = require('fs');

const start = new Date().getTime();

const getData = () => {
  const input = fs.readFileSync('./day10.txt');
  return input.toString().split('\n');
};

const input = getData();

const regexp = new RegExp(/<\s*(?<x>-*\d+),\s*(?<y>-*\d+)>.*=<\s*(?<vx>-*\d+),\s*(?<vy>-*\d+)/);

let minx = 0;
let miny = 0;
let maxx = 0;
let maxy = 0;

const points = input.reduce((acc, line) => {
  const match = line.match(regexp);
  match.groups.x = parseInt(match.groups.x);
  match.groups.y = parseInt(match.groups.y);
  match.groups.vx = parseInt(match.groups.vx);
  match.groups.vy = parseInt(match.groups.vy);
  maxx = match.groups.x > maxx ? match.groups.x : maxx;
  maxy = match.groups.y > maxy ? match.groups.y : maxy;
  minx = match.groups.x < minx ? match.groups.x : minx;
  miny = match.groups.y < miny ? match.groups.y : miny;
  return [...acc, match.groups];
}, []);

let time = 1;
let reachedZero = false;

while (true) {
  minx = 0;
  miny = 0;
  maxx = 0;
  maxy = 0;
  points.forEach(point => {
    point.x += point.vx;
    point.y += point.vy;
    maxx = point.x > maxx ? point.x : maxx;
    maxy = point.y > maxy ? point.y : maxy;
    minx = point.x < minx ? point.x : minx;
    miny = point.y < miny ? point.y : miny;
  });
  if (minx >= 0 && miny >= 0) {
    reachedZero = true;
    const canvas = [];
    for (let i = 0; i <= maxx; i++) {
      canvas[i] = ['.'];
      for (let j = 0; j <= maxy; j++) {
        canvas[i][j] = '.';
      }
    }
    points.forEach(point => {
      canvas[point.x][point.y] = '#';
    });
    canvas.forEach(line =>
      fs.appendFileSync(`./day10output/${time}.txt`, line.reverse().join('') + '\n')
    );
  }
  if (reachedZero && minx < 0 && miny < 0) {
    break;
  }
  time++;
}

const end = new Date().getTime();

console.log(`Finished in ${end - start}ms`);

/*
Finished in 1460ms
 */
