// @ts-nocheck
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
      line
        .slice(line.indexOf('(') + 1, line.indexOf(')'))
        .split('; ')
        .forEach(prop => {
          // console.log(type, attackType, prop);
          if (prop.indexOf('weak') === 0) {
            weakness = prop
              .replace('weak to ', '')
              .split(',')
              .map(v => v.trim());
          }
          if (prop.indexOf('immune') === 0) {
            immunity = prop
              .replace('immune to ', '')
              .split(',')
              .map(v => v.trim());
          }
        });
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
  this.target = null;
  this.attacker = null;
};
Group.prototype.effectivePower = function() {
  return this.units * this.attack;
};
Group.prototype.strike = function() {
  this.target.takeHit(this.effectivePower(), this.attackType);
};
Group.prototype.getDamage = function(power, type) {
  return this.immunity.indexOf(type) !== -1
    ? 0
    : this.weakness.indexOf(type) === -1
    ? power
    : power * 2;
};
Group.prototype.takeHit = function(power, type) {
  this.units -= Math.floor(this.getDamage(power, type) / this.hp);
};

const getTarget = (self, current, next) => {
  const nextDamage = next.getDamage(self.effectivePower(), self.attackType);
  if (current === null && nextDamage !== 0) {
    return next;
  }
  if (current === null) {
    return next;
  }
  const currentDamage = current.getDamage(self.effectivePower(), self.attackType);
  if (nextDamage > currentDamage) {
    return next;
  }
  if (nextDamage === currentDamage && next.effectivePower() > current.effectivePower()) {
    return next;
  }
  if (next.effectivePower() === current.effectivePower() && next.initiative > current.initiative) {
    return next;
  }
  return current;
};

const part1 = () => {
  // insert part1 here
  const [groups, immune, infection] = init();
  while (immune.size > 0 && infection.size > 0) {
    groups.sort((a, b) =>
      b.effectivePower() === a.effectivePower()
        ? b.initiative - a.initiative
        : b.effectivePower() - a.effectivePower()
    );
    groups.forEach(unit => {
      if (unit.units > 0) {
        let target = null;
        if (unit.team === 'infection') {
          immune.forEach(enemy => {
            if (!enemy.attacker && enemy.units > 0) {
              target = getTarget(unit, target, enemy);
            }
          });
        }
        if (unit.team === 'immune') {
          infection.forEach(enemy => {
            if (!enemy.attacker && enemy.units > 0) {
              target = getTarget(unit, target, enemy);
            }
          });
        }
        if (target) {
          unit.target = target;
          target.attacker = unit;
        }
      }
    });
    groups.sort((a, b) => b.initiative - a.initiative);
    groups.forEach(unit => {
      if (unit.units > 0 && unit.target) {
        unit.strike();
        if (unit.target.units <= 0) {
          unit.target.team === 'immune'
            ? immune.delete(unit.target)
            : infection.delete(unit.target);
        }
      }
      unit.attacker = null;
      unit.target = null;
    });
  }
  let totalUnits = 0;
  immune.forEach(unit => (totalUnits += unit.units > 0 ? unit.units : 0));
  infection.forEach(unit => (totalUnits += unit.units > 0 ? unit.units : 0));
  console.log('Answer1:', totalUnits);
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
