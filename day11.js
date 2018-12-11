const start = new Date().getTime();

let input = 9110;

let answer1 = { x: 0, y: 0, total: 0 };

const cellPower = (x, y) => (Math.floor((((x + 10) * y + input) * (x + 10)) / 100) % 10) - 5;

const gridPower = (x, y, size = 3) => {
  let total = 0;
  for (let i = x; i < x + size; i++) {
    for (let j = y; j < y + size; j++) {
      total += cellPower(i, j);
    }
  }
  return total;
};

for (let y = 1; y < 299; y++) {
  for (let x = 1; x < 299; x++) {
    const total = gridPower(x, y);
    if (total > answer1.total) {
      answer1 = { x, y, total };
    }
  }
}

console.log('Answer1:', answer1);

const int = new Date().getTime();

let answer2 = { x: 0, y: 0, size: 0, total: 0 };

for (let y = 1; y <= 300; y++) {
  for (let x = 1; x <= 300; x++) {
    let total = cellPower(x, y);
    if (total > answer2.total) {
      answer2 = { x, y, size: 1, total };
    }
    for (let size = 2; size <= 301 - Math.max(y, x); size++) {
      for (let i = x; i < x + size; i++) {
        total += cellPower(i, y + size - 1);
      }
      for (let i = y; i < y + size - 1; i++) {
        total += cellPower(x + size - 1, i);
      }
      if (total > answer2.total) {
        answer2 = { x, y, size, total };
      }
    }
  }
}

console.log('Answer2:', answer2);

const end = new Date().getTime();

console.log(`Finished in ${end - start}ms`);
console.log(`First part in ${int - start}ms`);
console.log(`Second part in ${end - int}ms`);

/*
Answer1: { x: 21, y: 13, total: 28 }
Answer2: { x: 235, y: 268, size: 13, total: 80 }
Finished in 8458ms
First part in 18ms
Second part in 8440ms
*/
