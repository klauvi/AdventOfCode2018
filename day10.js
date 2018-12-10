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

let time = 0;
let smallestGap = Number.MAX_SAFE_INTEGER;

while (true) {
  if (smallestGap > maxy - miny) {
    // Message is getting smaller but is still too big
    smallestGap = maxy - miny;
  } else {
    // revert last time change because we're past fewest lines in message
    points.forEach(point => {
      point.x -= point.vx;
      point.y -= point.vy;
    });
    time--;
    // draw canvas
    const canvas = [];
    for (let i = miny; i <= maxy; i++) {
      canvas[i] = ['.'];
      for (let j = minx; j <= maxx; j++) {
        canvas[i][j] = '.';
      }
    }
    points.forEach(point => {
      canvas[point.y][point.x] = '#';
    });
    console.log('Answer1:');
    canvas.forEach(line => console.log(line.join('')));
    console.log('Answer2:', time);
    break;
  }
  // Tick time and get min and max values
  minx = Number.MAX_SAFE_INTEGER;
  miny = Number.MAX_SAFE_INTEGER;
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
  time++;
  if (time > 11000) {
    // infinite loop guard
    console.log('time overflow');
    break;
  }
}

const end = new Date().getTime();

console.log(`Finished in ${end - start}ms`);

/*
Answer1:
........................................................................
........................................................................
........................................................................
........................................................................
........................................................................
......######..#....#..#####....####...#####...#####...#....#..#####.....
......#.......##...#..#....#..#....#..#....#..#....#..#....#..#....#....
......#.......##...#..#....#..#.......#....#..#....#..#....#..#....#....
......#.......#.#..#..#....#..#.......#....#..#....#..#....#..#....#....
......#####...#.#..#..#####...#.......#####...#####...######..#####.....
......#.......#..#.#..#..#....#..###..#.......#....#..#....#..#..#......
......#.......#..#.#..#...#...#....#..#.......#....#..#....#..#...#.....
......#.......#...##..#...#...#....#..#.......#....#..#....#..#...#.....
......#.......#...##..#....#..#...##..#.......#....#..#....#..#....#....
......#.......#....#..#....#...###.#..#.......#####...#....#..#....#....
........................................................................
........................................................................
........................................................................
........................................................................
........................................................................
Answer2: 10511
Finished in 343ms
*/
