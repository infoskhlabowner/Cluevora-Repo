export type Difficulty = 'Easy' | 'Normal' | 'Hard' | 'Expert' | 'Master';
export type CaseCategory = 'daily' | 'weekly' | 'monthly' | 'premium';

export interface Suspect {
  id: string;
  name: string;
  ageRange: string;
  occupation: string;
  relationship: string;
  statement: string;
}

export interface Clue {
  id: string;
  title: string;
  description: string;
  source: string;
  icon?: string;
}

export interface TimelineEvent {
  time: string;
  description: string;
}

export interface MysteryCase {
  id: string;
  dayNumber: number; // 1-365
  category: CaseCategory;
  title: string;
  difficulty: Difficulty;
  estimatedTime: number; // minutes
  introduction: string;
  location: string;
  victimOrObject: string;
  suspects: Suspect[];
  clues: Clue[];
  timeline: TimelineEvent[];
  theoryOptions: {
    motives: string[];
    methods: string[];
  };
  solution: {
    culpritId: string;
    motive: string;
    method: string;
    explanation: string;
  };
  hints: string[];
  rewards: {
    xp: number;
    coins: number;
  };
}

import generatedCases from './generated_cases.json';

const baseCases: MysteryCase[] = [
  {
    id: 'case-001',
    dayNumber: 1,
    category: 'daily',
    title: 'The Missing Diamond',
    difficulty: 'Easy',
    estimatedTime: 5,
    introduction: 'A valuable 50-carat diamond, on display for a single night, has vanished from a secure hotel suite. Security noted nothing unusual until the morning check. It is up to you to figure out who bypassed the locks and walked away with a fortune.',
    location: 'The Grand Vista Hotel, Suite 402',
    victimOrObject: 'The Azure Star Diamond',
    suspects: [
      {
        id: 's1',
        name: 'Alex Mercer',
        ageRange: '30s',
        occupation: 'Art Dealer',
        relationship: 'Rival Collector',
        statement: 'I was down at the hotel restaurant having dinner the entire evening. I have the receipt. I never even went up to the 4th floor.',
      },
      {
        id: 's2',
        name: 'Maria Rossi',
        ageRange: '40s',
        occupation: 'Hotel Manager',
        relationship: 'Staff',
        statement: 'I left my shift at 8:30 PM. I gave the master keycard to the night manager. I wasn\'t even in the building when it went missing.',
      },
      {
        id: 's3',
        name: 'David Thorne',
        ageRange: '50s',
        occupation: 'Private Security',
        relationship: 'Hired Guard',
        statement: 'I guarded the door until 9:00 PM. I never went inside the room. Someone else must have slipped by when I took my bathroom break.',
      }
    ],
    clues: [
      {
        id: 'c1',
        title: 'Hotel Keycard Records',
        description: 'Electronic logs show the door to Suite 402 was opened exactly once between 8:00 PM and 9:00 PM. It was opened at 8:20 PM using a Staff Master Keycard.',
        source: 'Security Office',
      },
      {
        id: 'c2',
        title: 'Restaurant Receipt',
        description: 'A receipt for a steak dinner paid by Alex Mercer. Timestamp: 8:05 PM.',
        source: 'Hotel Restaurant',
      },
      {
        id: 'c3',
        title: 'Security Camera',
        description: 'Lobby cameras show Maria Rossi walking out of the front doors of the hotel at 8:35 PM.',
        source: 'Lobby CCTV',
      }
    ],
    timeline: [
      { time: '7:30 PM', description: 'The diamond is verified to be in the display case.' },
      { time: '8:05 PM', description: 'Alex pays for dinner at the restaurant.' },
      { time: '8:20 PM', description: 'Suite 402 door is opened with a Master Keycard.' },
      { time: '8:35 PM', description: 'Maria is seen leaving the hotel lobby.' },
      { time: '9:00 PM', description: 'David finishes his security shift.' },
    ],
    theoryOptions: {
      motives: ['Financial Debt', 'Professional Jealousy', 'Corporate Espionage', 'Opportunity'],
      methods: ['Picked the lock', 'Used Master Keycard', 'Bribed Guard', 'Smashed Display'],
    },
    solution: {
      culpritId: 's2', // Maria Rossi
      motive: 'Financial Debt',
      method: 'Used Master Keycard',
      explanation: 'Maria claimed she left at 8:30 PM, but security footage caught her leaving at 8:35 PM. She also claimed she gave up her master keycard at 8:30 PM, but the room was opened at 8:20 PM using a master keycard. She used her keycard to steal the diamond at 8:20 PM, then left at 8:35 PM.'
    },
    hints: [
      "Review the exact times on the security footage versus Maria's statement.",
      "The master keycard was used. Who had access to it at that specific time?",
      "Someone claims they left early, but the cameras suggest otherwise."
    ],
    rewards: {
      xp: 250,
      coins: 100,
    }
  },
  {
    id: 'case-002',
    dayNumber: 2,
    category: 'weekly',
    title: 'The Silent Ledger',
    difficulty: 'Normal',
    estimatedTime: 8,
    introduction: 'A prominent tech CEO\'s private financial ledger has gone missing from his home safe. The safe was not forced open. Three people had the opportunity to be near the study during the timeframe.',
    location: 'Silicon Valley Mansion',
    victimOrObject: 'Private Ledger',
    suspects: [
      {
        id: 's1',
        name: 'Jordan Cole',
        ageRange: '20s',
        occupation: 'Personal Assistant',
        relationship: 'Employee',
        statement: 'I was organizing the mail in the foyer. I never went upstairs to the study. I saw the cleaner head up there around 2 PM.',
      },
      {
        id: 's2',
        name: 'Elena Vance',
        ageRange: '40s',
        occupation: 'Housekeeper',
        relationship: 'Staff',
        statement: 'I cleaned the study at 1:30 PM and locked the door behind me. I gave the key back to Mr. Cole immediately.',
      },
      {
        id: 's3',
        name: 'Marcus Reed',
        ageRange: '30s',
        occupation: 'Business Partner',
        relationship: 'Colleague',
        statement: 'I arrived at 3 PM for our meeting. I waited in the living room the whole time. I didn\'t even know where the study was.',
      }
    ],
    clues: [
      {
        id: 'c1',
        title: 'Study Door Lock Logs',
        description: 'The smart lock on the study door was opened at 1:30 PM and locked at 1:45 PM. It was opened again at 2:15 PM.',
        source: 'Smart Home System',
      },
      {
        id: 'c2',
        title: 'Foyer Camera',
        description: 'Jordan Cole is seen organizing mail at 1:00 PM, but leaves the camera view from 2:10 PM to 2:30 PM.',
        source: 'Security Camera',
      },
      {
        id: 'c3',
        title: 'Safe Access Log',
        description: 'The safe was opened using the backup PIN code at 2:20 PM.',
        source: 'Safe Electronics',
      }
    ],
    timeline: [
      { time: '1:00 PM', description: 'Jordan is seen in the foyer.' },
      { time: '1:30 PM', description: 'Elena enters the study to clean.' },
      { time: '1:45 PM', description: 'Elena locks the study door.' },
      { time: '2:15 PM', description: 'Study door is opened again.' },
      { time: '2:20 PM', description: 'Safe is opened using backup PIN.' },
      { time: '3:00 PM', description: 'Marcus arrives for the meeting.' },
    ],
    theoryOptions: {
      motives: ['Covering up embezzlement', 'Selling secrets', 'Revenge', 'Blackmail'],
      methods: ['Guessed the safe PIN', 'Used Backup PIN', 'Hacked the safe', 'Found the safe unlocked'],
    },
    solution: {
      culpritId: 's1',
      motive: 'Selling secrets',
      method: 'Used Backup PIN',
      explanation: 'Jordan claimed he never went upstairs and saw the cleaner go up at 2 PM. However, the logs show the cleaner was there at 1:30 PM. Jordan left the camera view at 2:10 PM, the door was opened at 2:15 PM, and the safe at 2:20 PM. Jordan had the key after Elena returned it to him at 1:45 PM.'
    },
    hints: [
      "Compare Jordan's timeline statement with the smart home logs.",
      "Who had the key to the study at 2:15 PM?",
      "Jordan's alibi of being in the foyer has a significant gap."
    ],
    rewards: {
      xp: 350,
      coins: 150,
    }
  },
  {
    id: 'case-003',
    dayNumber: 3,
    category: 'premium',
    title: 'Murder on the Express',
    difficulty: 'Hard',
    estimatedTime: 15,
    introduction: 'A locked-room mystery aboard a high-speed luxury train. A wealthy baron was found poisoned in his private compartment. The door was locked from the inside.',
    location: 'Continental Express, Car 4',
    victimOrObject: 'Baron von Kress',
    suspects: [
      {
        id: 's1',
        name: 'Isabella Kress',
        ageRange: '40s',
        occupation: 'Socialite',
        relationship: 'Wife',
        statement: 'I was in the dining car. He locked himself in to work.',
      }
    ],
    clues: [],
    timeline: [],
    theoryOptions: { motives: ['Inheritance'], methods: ['Poisoned Tea'] },
    solution: { culpritId: 's1', motive: 'Inheritance', method: 'Poisoned Tea', explanation: 'Premium case solution.' },
    hints: ["Check the tea."],
    rewards: { xp: 500, coins: 300 }
  }
];


const difficultyWeights: Record<Difficulty, number> = {
  'Easy': 1,
  'Normal': 2,
  'Hard': 3,
  'Expert': 4,
  'Master': 5
};

const combinedCases = [...baseCases, ...(generatedCases as MysteryCase[])];

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
          if (entityType === 'method') desc = `Analysis of the scene reveals anomalies. The method is [REDACTED].`;
          if (entityType === 'suspect') desc = `A witness reported seeing [REDACTED] acting suspiciously.`;
          if (entityType === 'motive') desc = `Background checks revealed [REDACTED] which could be a motive.`;
        } else {
          if (entityType === 'method') desc = `The forensic report is heavily corrupted. Fragment: 0xDEADBEEF.`;
          if (entityType === 'suspect') desc = `Witness testimony is classified. Clearance Level 4 required.`;
          if (entityType === 'motive') desc = `Personal records have been expunged from the main database.`;
        }
      }
      return { ...clue, description: desc };
    });

    let progressiveHints = c.hints;
    if (isGeneratedCaseTemplate && progress >= 0.2) {
       const culpritName = c.suspects.find(s => s.id === c.solution.culpritId)?.name || 'the culprit';
       progressiveHints = [
          `Informant leak: Motive is related to "${c.solution.motive}".`,
          `Forensics leak: Method used was likely "${c.solution.method}".`,
          `Witness leak: Look closely at ${culpritName}.`
       ];
    }

    return { ...c, dayNumber, clues: obfuscatedClues, hints: progressiveHints };
  });