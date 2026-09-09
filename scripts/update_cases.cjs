const fs = require('fs');
let content = fs.readFileSync('src/data/cases.ts', 'utf8');

const exportBlock = `
export const CASES: MysteryCase[] = combinedCases
  .sort((a, b) => difficultyWeights[a.difficulty] - difficultyWeights[b.difficulty])
  .map((c, index, array) => {
    const dayNumber = index + 1;
    const progress = (dayNumber - 1) / (array.length - 1 || 1); 

    const isGeneratedCaseTemplate = c.clues.some(clue => 
      clue.description.includes('clear signs of the method: ') ||
      clue.description.includes('revealed a strong motive: ')
    );

    const obfuscatedClues = c.clues.map(clue => {
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
          // Days 1-73: Very easy, full text
        } else if (progress < 0.4) {
          const obscuredValue = entityValue.split(' ').map(w => w.substring(0, 3) + '*'.repeat(Math.max(0, w.length - 3))).join(' ');
          desc = desc.replace(entityValue, obscuredValue);
        } else if (progress < 0.6) {
          const obscuredValue = '████████';
          desc = desc.replace(entityValue, obscuredValue);
        } else if (progress < 0.8) {
          if (entityType === 'method') desc = \`Analysis of the scene reveals anomalies. The method is [REDACTED].\`;
          if (entityType === 'suspect') desc = \`A witness reported seeing [REDACTED] acting suspiciously.\`;
          if (entityType === 'motive') desc = \`Background checks revealed [REDACTED] which could be a motive.\`;
        } else {
          if (entityType === 'method') desc = \`The forensic report is heavily corrupted. Fragment: 0xDEADBEEF.\`;
          if (entityType === 'suspect') desc = \`Witness testimony is classified. Clearance Level 4 required.\`;
          if (entityType === 'motive') desc = \`Personal records have been expunged from the main database.\`;
        }
      }
      return { ...clue, description: desc };
    });

    let progressiveHints = c.hints;
    if (isGeneratedCaseTemplate && progress >= 0.2) {
       const culpritName = c.suspects.find(s => s.id === c.solution.culpritId)?.name || 'the culprit';
       progressiveHints = [
          \`Informant leak: Motive is related to "\${c.solution.motive}".\`,
          \`Forensics leak: Method used was likely "\${c.solution.method}".\`,
          \`Witness leak: Look closely at \${culpritName}.\`
       ];
    }

    return { ...c, dayNumber, clues: obfuscatedClues, hints: progressiveHints };
  });
`;

content = content.replace(/export const CASES: MysteryCase\[\] = combinedCases[\s\S]*$/, exportBlock.trim());

fs.writeFileSync('src/data/cases.ts', content);
console.log('cases.ts updated');
