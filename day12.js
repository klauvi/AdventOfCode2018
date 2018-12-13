const fs = require('fs');

const start = new Date().getTime();

const getData = () => {
  const input = fs.readFileSync('./day12.txt');
  return input.toString().split('\n');
};

const input = getData();
const matches = {};
const initialState = input.shift().split(': ')[1];
let generation = 0;
let state = '....' + initialState + '....';
let negativity = 4;

input.forEach(line => {
  const [pattern, result] = line.split(' => ');
  matches[pattern] = result === '#';
});

while (generation < 200) {
  let addHead = false;
  let newState = state;
  for (let i = 2; i < state.length - 2; i++) {
    const check = state.slice(i - 2, i + 3);
    if (matches[check]) {
      // there will be plant
      newState = newState.substr(0, i) + '#' + newState.substr(i + 1);
      if (i < negativity) {
        // need dot at beginning
        addHead = true;
      }
      if (i === state.length - 3) {
        // need a dot at end
        newState += '.';
      }
    } else {
      // there will be no plant
      newState = newState.substr(0, i) + '.' + newState.substr(i + 1);
    }
  }
  if (addHead) {
    newState = '.' + newState;
    ++negativity;
  }
  ++generation;
  if (state.substr(state.indexOf('#')) === newState.substr(newState.indexOf('#'))) {
    state = newState;
    break;
  }
  state = newState;
}

const iFix = 50000000000 - generation;

let answer2 = 0;
const negative = state.substr(0, negativity);
state = state.substr(negativity);

answer2 = negative
  .split('')
  .reduce((acc, char, index) => (char === '#' ? acc + (index - negativity) : acc), 0);
answer2 = state
  .split('')
  .reduce((acc, char, index) => (char === '#' ? acc + index + iFix : acc), answer2);

const int = new Date().getTime();

const List = function(value, index, prev = null, next = null) {
  this.value = value;
  this.oldValue = value;
  this.check = value;
  this.index = index;
  this.prev = prev;
  this.next = next;
  if (prev) {
    prev.next = this;
  }
  if (next) {
    next.prev = this;
  }
  if (!prev) {
    // add prev if this or next contains #
    if (this.value === '#' || (this.next && this.next.value === '#')) {
      this.prev = new List('.', index - 1, null, this);
    }
  }
  if (!next) {
    // add next if this or prev contains #
    if (this.value === '#' || (this.prev && this.prev.value === '#')) {
      this.next = new List('.', index + 1, this);
    }
  }
};

List.prototype.getCheck = function() {
  let prev = true;
  let next = true;
  let check = '';
  if (this.prev) {
    if (this.prev.prev) {
      check += this.prev.prev.oldValue;
      this.prev.prev.oldValue = this.prev.prev.value;
    } else {
      check += '.';
    }
    check += this.prev.oldValue;
  } else {
    prev = false;
    check += '..';
  }
  check += this.oldValue;
  if (this.next) {
    if (this.next.value !== this.next.oldValue) {
      this.next.oldValue = this.next.value;
    }
    check += this.next.value;
    if (this.next.next) {
      if (this.next.next.value !== this.next.next.oldValue) {
        this.next.next.oldValue = this.next.next.value;
      }
      check += this.next.next.value;
    } else {
      check += '.';
    }
  } else {
    next = false;
    this.prev.oldValue = this.prev.value;
    check += '..';
  }
  this.check = check;
  return { check, prev, next };
};

let root = new List(initialState[0], 0);
let current = root;

for (let i = 1; i < initialState.length; i++) {
  current = new List(initialState[i], i, current);
}

const getRoot = () => {
  while (root.prev) {
    root = root.prev;
  }
};

generation = 0;

while (generation < 20) {
  getRoot();
  current = root;
  const changes = [true, true];
  while (current) {
    if (generation === 0 || !current.next || changes.indexOf(true) !== -1) {
      const { check, prev, next } = current.getCheck();
      current.value = matches[check] ? '#' : '.';
      if (!prev && (current.value === '#' || current.next.value === '#')) {
        current.prev = new List('.', current.index - 1, null, current);
      }
      if (!next) {
        current.oldValue = current.value;
        if (current.value === '#' || current.prev.value === '#') {
          current.next = new List('.', current.index + 1, current);
        }
        current = null;
      } else {
        changes[0] = changes[1];
        changes[1] = current.value !== current.oldValue;
        current = current.next;
      }
    } else {
      let check = current.prev.prev.value + current.prev.value + current.value + current.next.value;
      if (current.next.next) {
        check += current.next.next.value;
      } else {
        changes[1] = true;
        check += '.';
      }
      current.value = matches[check] ? '#' : '.';
      current.check = check;
      changes[0] = changes[1];
      changes[1] = current.value !== current.oldValue;
      current = current.next;
    }
  }
  ++generation;
  if (generation % 10000 === 0) {
    console.log(Math.floor((new Date().getTime() - int) / 1000));
  }
}

getRoot();
current = root;
let answer1 = 0;
while (current) {
  answer1 += current.value === '#' ? current.index : 0;
  current = current.next;
}
console.log('Answer1:', answer1);
console.log('Answer2:', answer2);

const end = new Date().getTime();

console.log(`Finished in ${end - start}ms`);
console.log(`First part in ${end - int}ms`);
console.log(`Second part in ${int - start}ms`);

/*
Answer1: 2995
Answer2: 3650000000377
Finished in 29ms
First part in 5ms
Second part in 24ms
 */
