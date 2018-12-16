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
      if (op.length > 1) {
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

const part2 = tests => {
  const indexToOp = {};
  const working = new Set(Array.apply(null, { length: 16 }).map(Number.call, Number));
  while (working.size > 0) {
    Object.keys(ops).forEach(key => {
      if (ops[key].code.size === 1) {
        const code = ops[key].code.values().next().value;
        if (working.has(code)) {
          indexToOp[code] = key;
          working.delete(code);
          Object.keys(ops).forEach(key2 => {
            if (key !== key2) {
              ops[key2].code.delete(code);
            }
          });
        }
      }
    });
  }
  let register = [0, 0, 0, 0];
  tests.forEach(test => {
    const op = indexToOp[test[0]];
    register = ops[op].fn([...register], test);
  });
  console.log('Answer2:', register[0]);
};

const [samples, tests] = init();
part1(samples);
const int = new Date().getTime();
part2(tests);
const end = new Date().getTime();

console.log(`Finished in ${end - start}ms`);
console.log(`First part in ${int - start}ms`);
console.log(`Second part in ${end - int}ms`);

/*
Answer1: 580
Answer2: 537
Finished in 37ms
First part in 34ms
Second part in 3ms
 */
