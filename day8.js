const fs = require('fs');
const Tree = require('./tree');

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

let i = 0;
const root = new Tree(input[i++], input[i++]);
let current = root;
let parent;
let total = 0;

const getMetadata = meta => {
  const metadata = input.slice(i, i + meta);
  i += meta;
  return { total: metadata.reduce((acc, val) => (acc += val), 0), array: metadata };
};

while (i < input.length) {
  if (current.isRoot() && current.isChildrenFull()) {
    const metadata = input.slice(i, input.length);
    current.value = metadata.reduce((acc, index) => (acc += current.getMetaValue(index)), 0);
    total += metadata.reduce((acc, val) => (acc += val), 0);
    break;
  }
  if (!current.isChildrenFull()) {
    // going down
    const children = input[i++];
    const meta = input[i++];
    const child = new Tree(children, meta, current);
    current.addChild(child);
    if (children === 0) {
      const metadata = getMetadata(meta);
      child.value = metadata.total;
      current.addMetaValue(metadata.total);
      total += metadata.total;
    } else {
      parent = current;
      current = child;
    }
  } else {
    // finish current
    const metadata = getMetadata(current.metaCount);
    current.value = metadata.array.reduce((acc, index) => (acc += current.getMetaValue(index)), 0);
    total += metadata.total;
    parent = current.getParent();
    parent.addMetaValue(current.value);
    // going up
    current = parent;
  }
}

console.log('Answer1:', total);
console.log('Answer2:', current.value);

const end = new Date().getTime();

console.log(`Finished in ${end - start}ms`);

/*
Answer1: 48496
Answer2: 32850
Finished in 14ms
 */
