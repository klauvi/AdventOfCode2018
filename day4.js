const fs = require('fs');

const start = new Date().getTime();

const getData = () => {
  const input = fs.readFileSync('./day4.txt');
  return input
    .toString()
    .split('\n')
    .sort();
};

const input = getData();

let guards = {};
let currentGuard = '';
let fellAsleep = 0;
let sleeping = false;

input.forEach(log => {
  const parts = log.split(']');
  const [date, time] = parts[0].split('[')[1].split(' ');
  const [hours, minutes] = time.split(':').map(Number);
  const [blank, status, id] = parts[1].split(' ');
  switch (status) {
    case 'Guard': {
      currentGuard = id;
      if (!guards[id]) {
        guards[id] = { total: 0, id: id.split('#').map(Number)[1] };
      }
      break;
    }
    case 'falls':
      fellAsleep = minutes;
      if (hours > 0) {
        console.log('Crap', log);
      }
      if (currentGuard === '') {
        console.log('No guard found');
      } else {
        guards[currentGuard][date] = [];
      }
      sleeping = true;
      break;
    case 'wakes': {
      if (currentGuard === '') {
        console.log('No guard found');
      } else if (!sleeping) {
        console.log('Guard wakes up before falling asleep');
      } else {
        for (let i = fellAsleep; i < minutes; i++) {
          guards[currentGuard][date].push(i);
          guards[currentGuard].total++;
        }
        sleeping = false;
      }
      break;
    }
  }
});

const maxSleep = Object.keys(guards).reduce(
  (acc, id) => {
    return guards[id].total > acc.total ? guards[id] : acc;
  },
  { total: 0 }
);

let minuteObject = {};

Object.keys(maxSleep).forEach(key => {
  if (!(typeof maxSleep[key] === 'number') && maxSleep[key].length > 0) {
    maxSleep[key].forEach(minute =>
      minuteObject[minute] ? minuteObject[minute]++ : (minuteObject[minute] = 1)
    );
  }
});

const theMinute = Object.keys(minuteObject).reduce(
  (acc, minute) =>
    minuteObject[minute] > acc.count
      ? { minute: parseInt(minute), count: minuteObject[minute] }
      : acc,
  { minute: 0, count: 0 }
);

console.log(theMinute, maxSleep.id);
console.log('Answer1:', theMinute.minute * maxSleep.id);

const int = new Date().getTime();

const end = new Date().getTime();

console.log(`Finished in ${end - start}ms`);
console.log(`First part in ${int - start}ms`);
console.log(`Second part in ${end - int}ms`);

/*
Answer1: 118840
Answer2: #919
Finished in 659ms
First part in 589ms
Second part in 70ms
*/
