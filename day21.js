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
  let smallest = Infinity;
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
      smallest = smallest > register[3] ? register[3] : smallest;
    }
  }
  console.log('Answer2:', smallest);
};

const part2start = part1();
const int = new Date().getTime();
part2(part2start);
const end = new Date().getTime();

console.log(`Finished in ${end - start}ms`);
console.log(`First part in ${int - start}ms`);
console.log(`Second part in ${end - int}ms`);

/*

18 'seti' '17' '0' '4' [ 0, 0, 65536, 1039046, 17, 9 ]
19 'addi' '5' '1' '1' [ 0, 10, 65536, 1039046, 18, 9 ]
20 'muli' '1' '256' '1' [ 0, 2560, 65536, 1039046, 19, 9 ]
21 'gtrr' '1' '2' '1' [ 0, 0, 65536, 1039046, 20, 9 ]
22 'addr' '1' '4' '4' [ 0, 0, 65536, 1039046, 21, 9 ]
24 'addi' '4' '1' '4' [ 0, 0, 65536, 1039046, 23, 9 ]
25 'addi' '5' '1' '5' [ 0, 0, 65536, 1039046, 24, 10 ]

18 'seti' '17' '0' '4' [ 0, 0, 65536, 1039046, 17, 144 ]
19 'addi' '5' '1' '1' [ 0, 145, 65536, 1039046, 18, 144 ]
20 'muli' '1' '256' '1' [ 0, 37120, 65536, 1039046, 19, 144 ]
21 'gtrr' '1' '2' '1' [ 0, 0, 65536, 1039046, 20, 144 ]
22 'addr' '1' '4' '4' [ 0, 0, 65536, 1039046, 21, 144 ]
24 'addi' '4' '1' '4' [ 0, 0, 65536, 1039046, 23, 144 ]
25 'addi' '5' '1' '5' [ 0, 0, 65536, 1039046, 24, 145 ]
 */
