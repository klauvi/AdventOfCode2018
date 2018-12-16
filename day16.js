const fs = require('fs');

const start = new Date().getTime();

const init = () => {
  const getData = () => {
    const input = fs.readFileSync('./day16.txt');
    // const input = fs.readFileSync('./test.txt');
    return input.toString().split('\n');
  };

  const input = getData();

  const samples = [];
  const tests = [];
  for (let i = 0; i < input.length; i++) {
    if (input[i].indexOf('Before') === 0) {
      const before = input[i++].match(/\d/g).map(Number);
      const op = input[i++].split(' ').map(Number);
      const after = input[i++]
        .match(/\d/g)
        .map(Number)
        .join('');
      samples.push({ before, op, after });
    } else {
      const op = input[i].split(' ').map(Number);
      if (op.length > 0) {
        tests.push(op);
      }
    }
  }
  return [samples, tests];
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
const opcodes = {};

const part1 = () => {
  const [samples, tests] = init();
  const answer1 = [];
  samples.forEach(sample => {
    const { before, op, after } = sample;
    const matches = Object.keys(ops).reduce((acc, key) => {
      const result = ops[key]([...before], op);
      if (result.join('') === after) {
        acc.push(key);
      }
      return acc;
    }, []);
    // if (matches.length === 2) {
    //   console.log(matches, before, op, after);
    //   opcodes[op[0]] = matches[0];
    // }
    if (matches.length >= 3) {
      answer1.push(matches.length);
    }
  });
  console.log('Answer1:', answer1.length);
};

part1();
const int = new Date().getTime();

console.log(opcodes);
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
{ '0': 0,
  '1': 55,
  '2': 145,
  '3': 50,
  '4': 102,
  '5': 0,
  '6': 94,
  '7': 96,
  '8': 48,
  '9': 146,
  '10': 0,
  '11': 0,
  '12': 0,
  '13': 44,
  '14': 0,
  '15': 0 }

 */
