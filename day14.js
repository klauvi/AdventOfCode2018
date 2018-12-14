const start = new Date().getTime();

let input = 513401;

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
let check = '000037';
let answer2 = 0;
let checkInput = input.toString();

// input = 2018;
// checkInput = '59414';

while (tail.index <= input + 10 || !found) {
  let sum = elves[0].value + elves[1].value;
  if (sum > 9) {
    tail = new Circle(1, tail, root);
    check = check.slice(1, check.length) + '1';
    sum = sum % 10;
    if (!found) {
      if (check === checkInput) {
        answer2 = tail.index - checkInput.length;
        found = true;
      }
    }
  }
  check = check.slice(1, check.length) + sum.toString();
  tail = new Circle(sum, tail, root);
  if (!found) {
    if (check === checkInput) {
      answer2 = tail.index - checkInput.length;
      found = true;
    }
  }
  elves[0] = move(elves[0]);
  elves[1] = move(elves[1]);
}

console.log('Answer1:', getAnswer1(input));
console.log('Answer2:', answer2);

const end = new Date().getTime();

console.log(`Finished in ${end - start}ms`);

/*
Answer1: 5371393113
Answer2: 20286858
Finished in 5007ms
 */
