const fs = require('fs');

const start = new Date().getTime();

const init = () => {
  const getData = () => {
    const filename = process.argv[2] || 'test';
    const input = fs.readFileSync(`./${filename}.txt`);
    return input.toString().split('\n');
  };

  const input = getData();
  const ip = input.shift().match(/\d+/)[0];
  return [Number(ip), [...input]];
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
  const [ip, instructions] = init();
  let ipValue = 0;
  let register = [0, 0, 0, 0, 0, 0];
  while (ipValue < 28) {
    const command = instructions[ipValue].split(' ')[0];
    const [a, b, c] = instructions[ipValue].match(/\d+/g).map(Number);
    register[Number(ip)] = ipValue;
    register = ops[command].fn([...register], [ip, a, b, c]);
    ipValue = register[Number(ip)] + 1;
  }
  console.log('Answer1:', register[3]);
  return register[3];
};

const part2 = start => {
  const [ip, instructions] = init();
  let ipValue = 0;
  const tracker = {};
  let last = 0;
  let register = [0, 0, 0, 0, 0, 0];
  while (true) {
    const command = instructions[ipValue].split(' ')[0];
    const [a, b, c] = instructions[ipValue].match(/\d+/g).map(Number);
    register[Number(ip)] = ipValue;
    register = ops[command].fn([...register], [ip, a, b, c]);
    ipValue = register[Number(ip)] + 1;
    if (ipValue === 28) {
      if (tracker[register[3]]) {
        break;
      }
      tracker[register[3]] = true;
      last = register[3];
    }
  }
  console.log('Answer2:', last);
};

const part2start = part1();
const int = new Date().getTime();
part2(part2start);
const end = new Date().getTime();

console.log(`Finished in ${end - start}ms`);
console.log(`First part in ${int - start}ms`);
console.log(`Second part in ${end - int}ms`);

/*
Answer1: 3909249
Answer2: 12333799
Finished in 2331527ms
First part in 13ms
Second part in 2331514ms
*/
