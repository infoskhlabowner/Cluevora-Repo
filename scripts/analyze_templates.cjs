const cases = require('../src/data/generated_cases.json');
let methodT = new Set();
let suspectT = new Set();
let motiveT = new Set();

cases.forEach(c => {
  c.clues.forEach(clue => {
    let text = clue.description;
    let original = text;
    c.theoryOptions.methods.forEach(m => text = text.replace(m, '[METHOD]'));
    c.theoryOptions.motives.forEach(m => text = text.replace(m, '[MOTIVE]'));
    c.suspects.forEach(s => text = text.replace(s.name, '[SUSPECT]'));
    
    if (text.includes('[METHOD]')) methodT.add(text);
    else if (text.includes('[SUSPECT]')) suspectT.add(text);
    else if (text.includes('[MOTIVE]')) motiveT.add(text);
  });
});

console.log('Method templates:', Array.from(methodT).length);
console.log('Suspect templates:', Array.from(suspectT).length);
console.log('Motive templates:', Array.from(motiveT).length);
