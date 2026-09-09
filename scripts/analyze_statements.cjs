const cases = require('../src/data/generated_cases.json');
console.log('Case 0 Suspects:');
cases[0].suspects.forEach(s => console.log(s.name, '-', s.statement));
console.log('Case 0 Timeline:');
cases[0].timeline.forEach(t => console.log(t.time, '-', t.description));
console.log('Case 0 Solution:');
console.log(cases[0].solution);
