const start = new Date().getTime();

const input = 513401;
// const input = 2018;

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

const root = new Circle(3);
let tail = new Circle(7, root, root);

let elves = [root, tail];

while (tail.index <= input + 10) {
  let sum = elves[0].value + elves[1].value;
  if (sum > 9) {
    tail = new Circle(1, tail, root);
    sum = sum % 10;
  }
  tail = new Circle(sum, tail, root);
  elves[0] = move(elves[0]);
  elves[1] = move(elves[1]);
}

let current = tail;

const getAnswer = index => {
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

console.log('Answer1:', getAnswer(input));

const int = new Date().getTime();

// insert part2 here, remember to refactor part1 to help with part2 solution 😊

console.log('Answer2:');

const end = new Date().getTime();

console.log(`Finished in ${end - start}ms`);
console.log(`First part in ${int - start}ms`);
console.log(`Second part in ${end - int}ms`);

/*
 */
