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

// Load guards object for both parts
input.forEach(log => {
  const parts = log.split(']');
  const [date, time] = parts[0].split('[')[1].split(' ');
  const [hours, minutes] = time.split(':').map(Number);
  const [blank, status, id] = parts[1].split(' ');
  switch (status) {
    case 'Guard': {
      currentGuard = id;
      if (!guards[id]) {
        // First seen, init guard object, storing id as number for later use
        guards[id] = { minutes: {}, total: 0, id: id.split('#').map(Number)[1] };
      }
      break;
    }
    case 'falls':
      fellAsleep = minutes;
      break;
    case 'wakes': {
      for (let i = fellAsleep; i < minutes; i++) {
        guards[currentGuard].total++;
        guards[currentGuard].minutes[i]
          ? guards[currentGuard].minutes[i]++
          : (guards[currentGuard].minutes[i] = 1);
      }
      break;
    }
  }
});

// Helper function for both parts, gets most frequent minute
const getMinute = obj =>
  Object.keys(obj).reduce(
    (acc, minute) =>
      obj[minute] > acc.count ? { minute: parseInt(minute), count: obj[minute] } : acc,
    { minute: 0, count: 0 }
  );

// Find guard with longest total sleep
const maxSleep = Object.keys(guards).reduce(
  (acc, id) => {
    return guards[id].total > acc.total ? guards[id] : acc;
  },
  { total: 0 }
);

const theMinute = getMinute(maxSleep.minutes);

console.log(theMinute, maxSleep.id);
console.log('Answer1:', theMinute.minute * maxSleep.id);

const int = new Date().getTime();

// Part 2: Find guard with most consistent minute slept
const mostConsistent = Object.keys(guards).reduce(
  (acc, key) => {
    const { minute, count } = getMinute(guards[key].minutes);
    const id = guards[key].id;
    return count > acc.count ? { id, minute, count } : acc;
  },
  {
    id: 0,
    minute: 0,
    count: 0
  }
);

console.log(mostConsistent);
console.log('Answer2:', mostConsistent.id * mostConsistent.minute);

const end = new Date().getTime();

console.log(`Finished in ${end - start}ms`);
console.log(`First part in ${int - start}ms`);
console.log(`Second part in ${end - int}ms`);

/*
{ minute: 44, count: 13 } 499
Answer1: 21956
{ id: 3449, minute: 39, count: 16 }
Answer2: 134511
Finished in 16ms
First part in 16ms
Second part in 0ms
*/
