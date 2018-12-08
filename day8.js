const fs = require('fs');

const start = new Date().getTime();

const getData = () => {
  const input = fs.readFileSync('./day8.txt');
  return input
    .toString()
    .split(' ')
    .map(Number);
};

const input = getData();

// const input = [2, 3, 0, 3, 10, 11, 12, 1, 1, 0, 1, 99, 2, 1, 1, 2];

let meta = [];
let children = [];
let next = 'child';
let hasChildren = false;

const answer1 = input.reduce((acc, num) => {
  if (next === 'child') {
    next = 'meta';
    if (num > 0) {
      // store child count if there are children
      children.push(num);
      hasChildren = true;
    } else {
      hasChildren = false;
    }
  } else if (next === 'meta') {
    // store meta count
    meta.push(num);
    if (hasChildren) {
      next = 'child';
    } else {
      next = 'data';
    }
  } else {
    // next is data
    acc += num;
    let metaCount = meta.pop();
    if (--metaCount > 0) {
      // There is more metadata
      meta.push(metaCount);
    } else {
      let nextChild = children.pop();
      if (--nextChild > 0) {
        children.push(nextChild);
        next = 'child';
      }
    }
  }
  return acc;
}, 0);

console.log('Answer1:', answer1);

const int = new Date().getTime();

// insert part2 here, remember to refactor part1 to help with part2 solution 😊

console.log('Answer2:');

const end = new Date().getTime();

console.log(`Finished in ${end - start}ms`);
console.log(`First part in ${int - start}ms`);
console.log(`Second part in ${end - int}ms`);

/*
 */
