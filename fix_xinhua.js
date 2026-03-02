const fs = require('fs');
const path = require('path');

const dictDir = '/Users/pangzhenzhu/Project1/qwerty-learner/public/dicts';
const filesToFix = ['Xinhua_All.json', 'Xinhua_1.json'];

// Helper to check if a toned pinyin matches a base pinyin
function isPinyinMatch(base, toned) {
  const normalize = (str) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
  return normalize(toned).toLowerCase() === base.toLowerCase();
}

// Helper to find toned pinyin in trans
function findTonedPinyin(transList, basePinyin, char) {
  if (!transList || transList.length === 0) return null;
  const combinedTrans = transList.join(' ');
  
  // Pattern 1: Char + whitespace + Pinyin
  // e.g. "还  huan" or "还 hái"
  // We need to match pinyin that *might* have tones
  const regex = new RegExp(`${char}\\s*([a-zāáǎàōóǒòēéěèīíǐìūúǔùǖǘǚǜ]+)`, 'i');
  const match = combinedTrans.match(regex);
  
  if (match) {
    const candidate = match[1];
    if (isPinyinMatch(basePinyin, candidate)) {
      return candidate;
    }
  }

  // Pattern 2: Look for the pinyin anywhere near the char or just present
  // This is harder. Let's try to find any word in trans that matches the base pinyin but has tones.
  const words = combinedTrans.split(/[^a-zāáǎàōóǒòēéěèīíǐìūúǔùǖǘǚǜ]+/i);
  for (const word of words) {
    if (isPinyinMatch(basePinyin, word) && word !== basePinyin) {
      // Prefer the one with tones
      return word;
    }
  }
  
  return null;
}

filesToFix.forEach(file => {
  const filePath = path.join(dictDir, file);
  if (!fs.existsSync(filePath)) return;
  
  console.log(`Processing ${file}...`);
  let data;
  try {
    data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    console.error(`Failed to parse ${file}`);
    return;
  }

  const notationMap = {};
  data.forEach((item, index) => {
    const notation = item.notation.trim();
    if (!notationMap[notation]) notationMap[notation] = [];
    notationMap[notation].push({ item, index });
  });

  let changesCount = 0;

  Object.keys(notationMap).forEach(notation => {
    const entries = notationMap[notation];
    if (entries.length > 1) {
      const names = new Set(entries.map(e => e.item.name));
      // Only process if names are different AND notation doesn't already have parens
      if (names.size > 1 && !notation.includes('(') && !notation.includes('（')) {
        
        entries.forEach(({ item }) => {
          let tonedPinyin = findTonedPinyin(item.trans, item.name, notation);
          // Fallback to name if no toned pinyin found
          const pinyin = tonedPinyin || item.name;
          
          item.notation = `${notation}(${pinyin})`;
          changesCount++;
        });
      }
    }
  });

  if (changesCount > 0) {
    console.log(`Updated ${changesCount} entries in ${file}`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } else {
    console.log(`No changes needed for ${file}`);
  }
});
