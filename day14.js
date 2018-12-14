const start = new Date().getTime();

// const input = 513401;
const input = 2018;

const Circle = function(value, prev = null, next = null) {
  this.value = value;
  this.prev = prev;
  this.next = next;
  if (!prev && !next) {
    this.index = 1;
  }
  if (prev) {
    prev.next = this;
    this.index = prev.index + 1;
  }
  if (next) {
    next.prev = this;
  }
};

const move = elf => {
  let current = elf;
  for (let i = 0; i <= elf.value; i++) {
    current = current.next;
  }
  return current;
};

const getAnswer1 = index => {
  let str = '';
  let current = tail;
  while (index + 1 < current.index) {
    current = current.prev;
  }
  while (str.length < 10) {
    str += current.value;
    current = current.next;
  }
  return str;
};

const root = new Circle(3);
let tail = new Circle(7, root, root);

let elves = [root, tail];
let found = false;
let check = [0, 0, 0, 3, 7];
let answer2 = 0;

let checkInput = 59414;

while (tail.index <= input + 10 || !found) {
  let sum = elves[0].value + elves[1].value;
  if (sum > 9) {
    tail = new Circle(1, tail, root);
    check.shift();
    check.push(1);
    sum = sum % 10;
  }
  check.shift();
  check.push(sum);
  tail = new Circle(sum, tail, root);
  if (!found) {
    if (tail.index > 2018) {
      console.log(parseInt(check.join('')), tail.index);
    }
    if (parseInt(check.join('')) === checkInput) {
      answer2 = tail.index - checkInput.toString().length;
      found = true;
    }
  }
  elves[0] = move(elves[0]);
  elves[1] = move(elves[1]);
  if (tail.index > 2030) {
    console.log('out of bounds');
    break;
  }
}

let current = tail;

console.log('Answer1:', getAnswer1(input));

const int = new Date().getTime();

// insert part2 here, remember to refactor part1 to help with part2 solution 😊

console.log('Answer2:', answer2);

const end = new Date().getTime();

console.log(`Finished in ${end - start}ms`);
console.log(`First part in ${int - start}ms`);
console.log(`Second part in ${end - int}ms`);

/*
 */
