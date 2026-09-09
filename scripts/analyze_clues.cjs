const cases = require('../src/data/generated_cases.json');
const clueSet = new Set();
cases.forEach(c => {
  c.clues.forEach(clue => {
    // replace specific names, motives, methods with placeholders to see patterns
    let text = clue.description;
    c.theoryOptions.methods.forEach(m => text = text.replace(m, '[METHOD]'));
    c.theoryOptions.motives.forEach(m => text = text.replace(m, '[MOTIVE]'));
    c.suspects.forEach(s => text = text.replace(s.name, '[SUSPECT]'));
    clueSet.add(text);
  });
});
console.log(Array.from(clueSet).slice(0, 20));
