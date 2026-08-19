const fs = require('fs');

const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen', 'Alex', 'Sam', 'Jordan', 'Taylor', 'Morgan'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris'];
const locations = ['The Grand Hotel', 'Silicon Valley Mansion', 'City Art Museum', 'Royal Observatory', 'Downtown Bank', 'Luxury Yacht', 'Tech Startup HQ', 'Central Park Gala', 'Old Library', 'Underground Vault', 'Midnight Express Train', 'Abandoned Warehouse', 'Private Island Estate', 'Casino Floor'];
const objects = ['Diamond Necklace', 'Confidential Hard Drive', 'Ancient Artifact', 'Prototype Watch', 'CEO Ledger', 'Winning Lottery Ticket', 'Master Key', 'Secret Recipe', 'Gold Bullion', 'Classified Documents', 'Famous Painting', 'Rare Coin Collection'];
const occupations = ['Manager', 'Security Guard', 'Assistant', 'CEO', 'Cleaner', 'Technician', 'Chef', 'Curator', 'Accountant', 'Director', 'Journalist', 'Pilot', 'Chauffeur', 'Valet', 'Software Engineer'];

const motives = ['Financial Debt', 'Professional Jealousy', 'Corporate Espionage', 'Opportunity', 'Covering up embezzlement', 'Selling secrets', 'Revenge', 'Blackmail', 'Inheritance'];
const methods = ['Picked the lock', 'Used Master Keycard', 'Bribed Guard', 'Smashed Display', 'Guessed the safe PIN', 'Used Backup PIN', 'Hacked the safe', 'Found the safe unlocked', 'Poisoned Tea', 'Inside Job', 'Social Engineering'];

function randomPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const generatedCases = [];
for (let i = 4; i <= 356; i++) {
  const victimOrObject = randomPick(objects);
  const location = randomPick(locations);
  const motive = randomPick(motives);
  const method = randomPick(methods);
  
  const suspects = [
    { id: 's1', name: randomPick(firstNames) + ' ' + randomPick(lastNames), ageRange: '30s', occupation: randomPick(occupations), relationship: 'Suspect A', statement: 'I was nowhere near the scene. I was having dinner.' },
    { id: 's2', name: randomPick(firstNames) + ' ' + randomPick(lastNames), ageRange: '40s', occupation: randomPick(occupations), relationship: 'Suspect B', statement: 'I saw someone else acting suspiciously near the area.' },
    { id: 's3', name: randomPick(firstNames) + ' ' + randomPick(lastNames), ageRange: '20s', occupation: randomPick(occupations), relationship: 'Suspect C', statement: 'I was working my shift and didn\'t notice anything unusual.' }
  ];

  const culpritId = 's' + (Math.floor(Math.random() * 3) + 1);
  const culprit = suspects.find(s => s.id === culpritId);

  generatedCases.push({
    id: 'case-' + String(i).padStart(3, '0'),
    dayNumber: i,
    category: 'daily',
    title: `The Mystery of the ${victimOrObject}`,
    difficulty: Math.random() > 0.7 ? 'Hard' : Math.random() > 0.4 ? 'Normal' : 'Easy',
    estimatedTime: Math.floor(Math.random() * 10) + 5,
    introduction: `A highly valuable ${victimOrObject} has been reported missing at ${location}. Three individuals were known to be in the restricted area during the incident. Review the evidence to determine who is responsible.`,
    location: location,
    victimOrObject: victimOrObject,
    suspects: suspects,
    clues: [
      { id: 'c1', title: 'Security Log Analysis', description: `Digital footprints and access logs show clear signs of the method: ${method}.`, source: 'Cyber Security Team' },
      { id: 'c2', title: 'Witness Testimony', description: `A secondary witness placed ${culprit.name} closer to the scene than they claimed in their statement.`, source: 'Anonymous Tip' },
      { id: 'c3', title: 'Financial Records', description: `A deep dive into personal records revealed a strong motive: ${motive}.`, source: 'Financial Auditor' }
    ],
    timeline: [
      { time: '18:00', description: `The ${victimOrObject} was last verified secure.` },
      { time: '20:15', description: 'The incident is estimated to have occurred.' },
      { time: '21:30', description: 'The disappearance was officially discovered and reported.' }
    ],
    theoryOptions: {
      motives: motives,
      methods: methods
    },
    solution: {
      culpritId: culpritId,
      motive: motive,
      method: method,
      explanation: `The evidence directly contradicts ${culprit.name}'s statement. The security logs confirm the method used was '${method}', and financial records exposed their motive of '${motive}'.`
    },
    hints: [
      'Cross-reference the witness testimony with the suspect statements.',
      'Pay close attention to the financial records.',
      'The security log analysis gives away the exact method used.'
    ],
    rewards: { xp: 200, coins: 50 }
  });
}

fs.writeFileSync('src/data/generated_cases.json', JSON.stringify(generatedCases, null, 2));
console.log('Successfully generated 353 additional cases.');
