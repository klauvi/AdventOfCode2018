const fs = require('fs');

const start = new Date().getTime();

const init = () => {
  const getData = () => {
    const input = fs.readFileSync('./changeme.txt');
    // const input = fs.readFileSync('./test.txt');
    return input.toString().split('\n');
  };

  const input = getData();
  return [input];
};

const part1 = () => {
  // insert part1 here, remember to change input filename
  console.log('Answer1:');
};

const part2 = () => {
  // insert part2 here, remember to refactor part1 to help with part2 solution 😊
  console.log('Answer2:');
};

part1();
const int = new Date().getTime();
part2();
const end = new Date().getTime();

console.log(`Finished in ${end - start}ms`);
console.log(`First part in ${int - start}ms`);
console.log(`Second part in ${end - int}ms`);

/*
 */
