const fs = require('fs'); // Idea of using fs borrowed from @fhinkel

const start = new Date().getTime();

const getData = () => {
  const input = fs.readFileSync('./day1.txt');
  return input
    .toString()
    .split('\n')
    .map(Number); // Learned this from @fhinkel
};

const input = getData();

const freq = input.reduce((acc, val) => acc + val, 0);

console.log('Answer1:', freq);

/*
const freqs = new Set(); // Learned about Set() from @fhinkel

// Learned from @pete_tnt, brilliant using [i % input.length] to continuously loop through input
for (let i = 0, sum = 0; true; i++) {
  sum += input[i % input.length];
  if (freqs.has(sum)) {
    console.log('Answer2:', sum);
    break;
  }
  freqs.add(sum);
}

Answer1: 425
Answer2: 57538
Finished in 27ms
*/

let history = {};
let current = 0;
let searching = true;

while (searching) {
  input.some(val => {
    if (history[current] === true) {
      console.log('Answer2:', current);
      searching = false;
      return true;
    } else {
      history[current] = true;
      current += val;
      return false;
    }
  });
}

const end = new Date().getTime();

console.log(`Finished in ${end - start}ms`);

/*
Answer1: 425
Answer2: 57538
Finished in 16ms
*/
