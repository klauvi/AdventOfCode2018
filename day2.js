const fs = require('fs'); // Idea of using fs borrowed from @fhinkel

const start = new Date().getTime();

const getData = () => {
  const input = fs.readFileSync('./day2.txt');
  return input.toString().split('\n');
};

const input = getData();

const [double, triple] = input.reduce(
  (acc, word) => {
    const pairs = word
      .split('')
      .sort()
      .join('')
      .match(/(.)\1*/g); // Learned from @pete_tnt sorting string and using regex to get array with each char
    if (pairs.some(letter => letter.length === 2)) {
      acc[0]++;
    }
    if (pairs.some(letter => letter.length === 3)) {
      acc[1]++;
    }
    return acc;
  },
  [0, 0]
);

console.log('Answer1:', double * triple);

const int = new Date().getTime();

input.forEach(word => {
  input.forEach(word2 => {
    let diff = 0;
    for (let i = 0; i < word.length; i++) {
      if (word[i] !== word2[i]) {
        diff++;
      }
    }
    if (diff === 1) {
      let common = [];
      for (let i = 0; i < word.length; i++) {
        if (word[i] === word2[i]) {
          common.push(word[i]);
        }
      }
      console.log('Answer2:', common.join(''));
    }
  });
});

const end = new Date().getTime();

console.log(`Finished in ${end - start}ms`);
console.log(`First part in ${int - start}ms`);
console.log(`Second part in ${end - int}ms`);

/*
Answer1: 7776
Answer2: wlkigsqyfecjqqmnxaktdrhbz
Answer2: wlkigsqyfecjqqmnxaktdrhbz
Finished in 40ms
First part in 10ms
Second part in 30ms
*/
