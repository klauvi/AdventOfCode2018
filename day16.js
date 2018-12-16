const fs = require('fs');

const start = new Date().getTime();

const init = () => {
  const getData = () => {
    const input = fs.readFileSync('./day16.txt');
    // const input = fs.readFileSync('./test.txt');
    return input.toString().split('\n');
  };

  const input = getData();
  return [input];
};

const ops = {
  addr: (register, [, vA, vB, vC]) => {
    register[vC] = register[vA] + register[vB];
    return [...register];
  },
  addi: (register, [, vA, vB, vC]) => {
    register[vC] = register[vA] + vB;
    return [...register];
  },
  mulr: (register, [, vA, vB, vC]) => {
    register[vC] = register[vA] * register[vB];
    return [...register];
  },
  muli: (register, [, vA, vB, vC]) => {
    register[vC] = register[vA] * vB;
    return [...register];
  },
  banr: (register, [, vA, vB, vC]) => {
    register[vC] = register[vA] & register[vB];
    return [...register];
  },
  bani: (register, [, vA, vB, vC]) => {
    register[vC] = register[vA] & vB;
    return [...register];
  },
  borr: (register, [, vA, vB, vC]) => {
    register[vC] = register[vA] | register[vB];
    return [...register];
  },
  bori: (register, [, vA, vB, vC]) => {
    register[vC] = register[vA] | vB;
    return [...register];
  },
  setr: (register, [, vA, vB, vC]) => {
    register[vC] = register[vA];
    return [...register];
  },
  seti: (register, [, vA, vB, vC]) => {
    register[vC] = vA;
    return [...register];
  },
  gtir: (register, [, vA, vB, vC]) => {
    register[vC] = vA > register[vB] ? 1 : 0;
    return [...register];
  },
  gtri: (register, [, vA, vB, vC]) => {
    register[vC] = register[vA] > vB ? 1 : 0;
    return [...register];
  },
  gtrr: (register, [, vA, vB, vC]) => {
    register[vC] = register[vA] > register[vB] ? 1 : 0;
    return [...register];
  },
  eqir: (register, [, vA, vB, vC]) => {
    register[vC] = vA === register[vB] ? 1 : 0;
    return [...register];
  },
  eqri: (register, [, vA, vB, vC]) => {
    register[vC] = register[vA] === vB ? 1 : 0;
    return [...register];
  },
  eqrr: (register, [, vA, vB, vC]) => {
    register[vC] = register[vA] === register[vB] ? 1 : 0;
    return [...register];
  }
};

const part1 = () => {
  const [input] = init();
  const answer1 = [];
  for (let i = 0; i < input.length; i++) {
    if (input[i].indexOf('Before') === 0) {
      const before = input[i++].match(/\d/g).map(Number);
      const op = input[i++].split(' ').map(Number);
      const after = input[i++]
        .match(/\d/g)
        .map(Number)
        .join('');
      let matches = Object.keys(ops).reduce((acc, key) => {
        const result = ops[key]([...before], op);
        acc += result.join('') === after ? 1 : 0;
        return acc;
      }, 0);
      if (matches >= 3) {
        answer1.push(matches);
      }
    } else {
      break;
    }
  }
  console.log('Answer1:', answer1.length);
};

part1();
const int = new Date().getTime();

const part2 = () => {
  // insert part2 here, remember to refactor part1 to help with part2 solution 😊

  console.log('Answer2:');
};

part2();
const end = new Date().getTime();

console.log(`Finished in ${end - start}ms`);
console.log(`First part in ${int - start}ms`);
console.log(`Second part in ${end - int}ms`);

/*
 */
