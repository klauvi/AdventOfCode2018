const fs = require('fs');

const start = new Date().getTime();

const init = () => {
  const getData = () => {
    const filename = process.argv[2] || 'test';
    const input = fs.readFileSync(`./${filename}.txt`);
    return input.toString().split('\n');
  };

  const input = getData();
  const groups = [];
  const immune = new Set();
  const infection = new Set();
  let type = 'immune';
  for (let line of input) {
    if (line === '') {
      continue;
    }
    if (line.indexOf('Immune') === 0) {
      type = 'immune';
      continue;
    }
    if (line.indexOf('Infection') === 0) {
      type = 'infection';
      continue;
    }
    const [units, hp, attack, initiative] = line.match(/\d+/g).map(Number);
    const words = line.split(' ');
    const attackType = words[words.length - 5];
    let weakness = [];
    let immunity = [];
    if (line.indexOf('(') !== -1) {
      const strengths = line.slice(line.indexOf('(') + 1, line.indexOf(')'));
      if (strengths.indexOf(';') !== -1) {
        const [weak, immune] = strengths.split(';');
        weakness = weak
          .slice(8)
          .split(',')
          .map(v => v.trim());
        immunity = immune
          .slice(10)
          .split(',')
          .map(v => v.trim());
      } else {
        weakness =
          strengths.indexOf('weak') === 0
            ? strengths
                .slice(8)
                .split(',')
                .map(v => v.trim())
            : [];
        immunity =
          strengths.indexOf('immune') === 0
            ? strengths
                .slice(10)
                .split(',')
                .map(v => v.trim())
            : [];
      }
    }
    const item = new Group(type, units, hp, attack, attackType, initiative, weakness, immunity);
    groups.push(item);
    type === 'immune' ? immune.add(item) : infection.add(item);
  }
  return [groups, immune, infection];
};

const Group = function(team, units, hp, attack, attackType, initiative, weakness, immunity) {
  this.team = team;
  this.units = units;
  this.hp = hp;
  this.attack = attack;
  this.attackType = attackType;
  this.initiative = initiative;
  this.weakness = weakness;
  this.immunity = immunity;
};

const part1 = () => {
  // insert part1 here
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
