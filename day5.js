const fs = require('fs');

const start = new Date().getTime();

const getData = () => {
  const input = fs.readFileSync('./day5.txt');
  return input.toString();
};

const input = getData();

const react = (a, b) => {
  const lowercase = !!(a === a.toLowerCase());
  return (lowercase && a.toUpperCase() === b) || (!lowercase && a.toLowerCase() === b);
};

const getPolymer = data => {
  let final = [];
  let i = 0;
  while (i < data.length - 1) {
    if (react(data[i], data[i + 1])) {
      i += 2; // they react, ignore both
      while (true) {
        if (final.length > 0 && data[i]) {
          // if there's something in final and there is next char, check if last there reacts to next char
          if (react(data[i], final[final.length - 1])) {
            i++; // they react, check next and remove last from final
            final.pop();
          } else {
            break;
          }
        } else {
          break;
        }
      }
    } else {
      // console.log(data[i], 'did not react to', data[i + 1]);
      final.push(data[i++]);
    }
  }
  return final;
};

const firstPolymer = getPolymer(input);

console.log('Answer1:', firstPolymer.length);

const int = new Date().getTime();

const alphabet = 'abcdefghijklmnopqrstuvwxyz';

const secondPolymer = alphabet.split('').reduce((acc, char) => {
  const reg = new RegExp(char, 'gi');
  const polymer = getPolymer(input.replace(reg, ''));
  return polymer.length < acc ? polymer.length : acc;
}, firstPolymer.length);

console.log('Answer2:', secondPolymer);

const end = new Date().getTime();

console.log(`Finished in ${end - start}ms`);
console.log(`First part in ${int - start}ms`);
console.log(`Second part in ${end - int}ms`);

/*
Answer1: 9900
Answer2: 4992
Finished in 103ms
First part in 15ms
Second part in 88ms
*/
