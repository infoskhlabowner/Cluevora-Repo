const cases = require('../src/data/generated_cases.json');
console.log('Sample clues for case 5:');
cases[5].clues.forEach(c => console.log(c.description));
