const fs = require('fs');
const path = require('path');

const dictDir = '/Users/pangzhenzhu/Project1/qwerty-learner/public/dicts';
const filesToCheck = [
  'HSK_1_All.json', 'HSK_2_All.json', 'HSK_3_All.json', 
  'HSK_4_All.json', 'HSK_5_All.json', 'HSK_6_All.json',
  'Xinhua_All.json', 'Xinhua_1.json'
];

filesToCheck.forEach(file => {
  const filePath = path.join(dictDir, file);
  if (!fs.existsSync(filePath)) return;

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);
    
    // Group by notation
    const notationMap = {};
    data.forEach(item => {
      // Normalize notation to ignore existing brackets for initial grouping
      // But we really want to find cases where the notation IS ambiguous (i.e., just the char)
      const notation = item.notation.trim();
      if (!notationMap[notation]) {
        notationMap[notation] = [];
      }
      notationMap[notation].push(item);
    });

    Object.keys(notationMap).forEach(notation => {
      const items = notationMap[notation];
      if (items.length > 1) {
        // Check if they have different names (pronunciations)
        const names = new Set(items.map(i => i.name));
        if (names.size > 1) {
          // Check if notation already distinguishes them (e.g. has brackets)
          const hasBrackets = notation.includes('(') || notation.includes('（');
          
          if (!hasBrackets) {
             console.log(`File: ${file} | Char: ${notation} | Names: ${Array.from(names).join(', ')}`);
          }
        }
      }
    });

  } catch (err) {
    console.error(`Error reading ${file}:`, err.message);
  }
});
