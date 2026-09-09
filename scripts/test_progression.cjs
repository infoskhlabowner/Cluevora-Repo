const cases = require('../src/data/generated_cases.json');

const testCases = [cases[0], cases[Math.floor(cases.length * 0.3)], cases[Math.floor(cases.length * 0.5)], cases[Math.floor(cases.length * 0.7)], cases[cases.length - 1]];

testCases.forEach((c, index) => {
    let progress = index / (testCases.length - 1);
    
    console.log(`\n--- PROGRESS ${progress} ---`);
    c.clues.forEach(clue => {
      let desc = clue.description;
      const methodPrefix = 'clear signs of the method: ';
      const suspectPrefix = 'witness placed ';
      const suspectSuffix = ' closer to the scene';
      const motivePrefix = 'revealed a strong motive: ';

      let entityType = '';
      let entityValue = '';
      
      if (desc.includes(methodPrefix)) {
        entityType = 'method';
        entityValue = desc.split(methodPrefix)[1].replace('.', '');
      } else if (desc.includes(suspectPrefix) && desc.includes(suspectSuffix)) {
        entityType = 'suspect';
        entityValue = desc.substring(desc.indexOf(suspectPrefix) + suspectPrefix.length, desc.indexOf(suspectSuffix));
      } else if (desc.includes(motivePrefix)) {
        entityType = 'motive';
        entityValue = desc.split(motivePrefix)[1].replace('.', '');
      }

      if (entityType && entityValue) {
        if (progress < 0.2) {
          // unchanged
        } else if (progress < 0.4) {
          const obscuredValue = entityValue.split(' ').map(w => w.substring(0, 3) + '*'.repeat(Math.max(0, w.length - 3))).join(' ');
          desc = desc.replace(entityValue, obscuredValue);
        } else if (progress < 0.6) {
          const obscuredValue = '████████';
          desc = desc.replace(entityValue, obscuredValue);
        } else if (progress < 0.8) {
          if (entityType === 'method') desc = `Analysis of the scene reveals anomalies. The method is [REDACTED].`;
          if (entityType === 'suspect') desc = `A witness reported seeing [REDACTED] acting suspiciously.`;
          if (entityType === 'motive') desc = `Background checks revealed [REDACTED] which could be a motive.`;
        } else {
          if (entityType === 'method') desc = `The forensic report is heavily corrupted. Fragment: 0xDEADBEEF.`;
          if (entityType === 'suspect') desc = `Witness testimony is classified. Clearance Level 4 required.`;
          if (entityType === 'motive') desc = `Personal records have been expunged from the main database.`;
        }
      }
      console.log(entityType.toUpperCase() + ":", desc);
    });
});
