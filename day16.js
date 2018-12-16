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
  addr: {
    code: new Set(),
    fn: (register, [, vA, vB, vC]) => {
      register[vC] = register[vA] + register[vB];
      return [...register];
    }
  },
  addi: {
    code: new Set(),
    fn: (register, [, vA, vB, vC]) => {
      register[vC] = register[vA] + vB;
      return [...register];
    }
  },
  mulr: {
    code: new Set(),
    fn: (register, [, vA, vB, vC]) => {
      register[vC] = register[vA] * register[vB];
      return [...register];
    }
  },
  muli: {
    code: new Set(),
    fn: (register, [, vA, vB, vC]) => {
      register[vC] = register[vA] * vB;
      return [...register];
    }
  },
  banr: {
    code: new Set(),
    fn: (register, [, vA, vB, vC]) => {
      register[vC] = register[vA] & register[vB];
      return [...register];
    }
  },
  bani: {
    code: new Set(),
    fn: (register, [, vA, vB, vC]) => {
      register[vC] = register[vA] & vB;
      return [...register];
    }
  },
  borr: {
    code: new Set(),
    fn: (register, [, vA, vB, vC]) => {
      register[vC] = register[vA] | register[vB];
      return [...register];
    }
  },
  bori: {
    code: new Set(),
    fn: (register, [, vA, vB, vC]) => {
      register[vC] = register[vA] | vB;
      return [...register];
    }
  },
  setr: {
    code: new Set(),
    fn: (register, [, vA, vB, vC]) => {
      register[vC] = register[vA];
      return [...register];
    }
  },
  seti: {
    code: new Set(),
    fn: (register, [, vA, vB, vC]) => {
      register[vC] = vA;
      return [...register];
    }
  },
  gtir: {
    code: new Set(),
    fn: (register, [, vA, vB, vC]) => {
      register[vC] = vA > register[vB] ? 1 : 0;
      return [...register];
    }
  },
  gtri: {
    code: new Set(),
    fn: (register, [, vA, vB, vC]) => {
      register[vC] = register[vA] > vB ? 1 : 0;
      return [...register];
    }
  },
  gtrr: {
    code: new Set(),
    fn: (register, [, vA, vB, vC]) => {
      register[vC] = register[vA] > register[vB] ? 1 : 0;
      return [...register];
    }
  },
  eqir: {
    code: new Set(),
    fn: (register, [, vA, vB, vC]) => {
      register[vC] = vA === register[vB] ? 1 : 0;
      return [...register];
    }
  },
  eqri: {
    code: new Set(),
    fn: (register, [, vA, vB, vC]) => {
      register[vC] = register[vA] === vB ? 1 : 0;
      return [...register];
    }
  },
  eqrr: {
    code: new Set(),
    fn: (register, [, vA, vB, vC]) => {
      register[vC] = register[vA] === register[vB] ? 1 : 0;
      return [...register];
    }
  }
};

const part1 = samples => {
  const answer1 = [];
  samples.forEach(sample => {
    const { before, op, after } = sample;
    const matches = Object.keys(ops).reduce((acc, key) => {
      const result = ops[key].fn([...before], op);
      if (result.join('') === after) {
        acc.push(key);
        ops[key].code.add(op[0]);
      }
      return acc;
    }, []);
    if (matches.length >= 3) {
      answer1.push(matches.length);
    }
  });
  console.log('Answer1:', answer1.length);
};

const [samples, tests] = init();

part1(samples);
const int = new Date().getTime();

Object.keys(ops).forEach(key => console.log(key, ops[key].code));
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
