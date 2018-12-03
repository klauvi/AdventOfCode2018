const fs = require('fs'); // Idea of using fs borrowed from @fhinkel

const start = new Date().getTime();

const getData = () => {
  const input = fs.readFileSync('./day3.txt');
  return input.toString().split('\n');
};

const input = getData();

let area = {};
let overlap = 0;
input.forEach(sq => {
  const parts = sq.split(' ');
  const [x, y] = parts[2].split(':')[0].split(',');
  const [sx, sy] = parts[3].split('x');
  for (let i = parseInt(x); i < parseInt(x) + parseInt(sx); i++) {
    for (let j = parseInt(y); j < parseInt(y) + parseInt(sy); j++) {
      const point = `${i},${j}`;
      if (area[point] === 1) {
        overlap++;
        area[point]++;
      } else {
        area[point] ? area[point]++ : (area[point] = 1);
      }
    }
  }
});

console.log('Answer1:', overlap);

const int = new Date().getTime();

input.forEach(sq => {
  let clash = false;
  const parts = sq.split(' ');
  const [x, y] = parts[2].split(':')[0].split(',');
  const [sx, sy] = parts[3].split('x');
  for (let i = parseInt(x); i < parseInt(x) + parseInt(sx); i++) {
    for (let j = parseInt(y); j < parseInt(y) + parseInt(sy); j++) {
      if (area[`${i},${j}`] !== 1) {
        clash = true;
        break;
      }
    }
    if (clash) {
      break;
    }
  }
  if (!clash) {
    console.log('Answer2:', parts[0]);
  }
});

const end = new Date().getTime();

console.log(`Finished in ${end - start}ms`);
console.log(`First part in ${int - start}ms`);
console.log(`Second part in ${end - int}ms`);

/*
Answer1: 118840
Answer2: #919
Finished in 659ms
First part in 589ms
Second part in 70ms
*/
