const fs = require('fs');

const start = new Date().getTime();

const init = () => {
  const getData = () => {
    const input = fs.readFileSync('./day19.txt');
    // const input = fs.readFileSync('./test.txt');
    return input.toString().split('\n');
  };

  const input = getData();
  return [input];
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

const part1 = () => {
  const [input] = init();
  const ip = input[0].match(/\d+/g).map(Number)[0];
  let ipValue = 0;
  const instructions = input.slice(1);
  let register = [0, 0, 0, 0, 0, 0];
  while (ipValue < instructions.length) {
    const command = instructions[ipValue].split(' ')[0];
    const [a, b, c] = instructions[ipValue].match(/\d+/g).map(Number);
    register[ip] = ipValue;
    register = ops[command].fn([...register], [ip, a, b, c]);
    ipValue = register[ip] + 1;
  }
  console.log('Answer1:', register[0]);
};

const part2 = () => {
  const [input] = init();
  const ip = input[0].match(/\d+/g).map(Number)[0];
  let ipValue = 0;
  const instructions = input.slice(1);
  let register = [1, 0, 0, 0, 0, 0];
  let pattern = {};
  while (ipValue < instructions.length) {
    const command = instructions[ipValue].split(' ')[0];
    const [a, b, c] = instructions[ipValue].match(/\d+/g).map(Number);
    register[ip] = ipValue;
    register = ops[command].fn([...register], [ip, a, b, c]);
    ipValue = register[ip] + 1;
    if (pattern[register[5] * ipValue] === register[2] && ipValue === 3) {
      while (register[2] <= register[5]) {
        if (register[5] % register[2] === 0) {
          register[0] += register[2];
        }
        if (register[5] / 2 < register[2]) {
          register[0] += register[5];
          break;
        }
        ++register[2];
        ipValue++;
      }
      break;
    } else {
      pattern[register[5] * ipValue] = register[2];
    }
  }
  console.log('Answer2:', register[0]);
};

part1();
const int = new Date().getTime();
part2();
const end = new Date().getTime();

console.log(`Finished in ${end - start}ms`);
console.log(`First part in ${int - start}ms`);
console.log(`Second part in ${end - int}ms`);

/*
Answer1: 1374
Answer2: 15826974
Finished in 6316ms
First part in 6252ms
Second part in 64ms
 */
