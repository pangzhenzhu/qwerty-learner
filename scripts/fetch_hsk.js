const https = require('https');
const fs = require('fs');
const path = require('path');

const dictsDir = path.join(__dirname, '../public/dicts');

// Tone mapping
const toneMap = {
    'ā': 'a', 'á': 'a', 'ǎ': 'a', 'à': 'a',
    'ō': 'o', 'ó': 'o', 'ǒ': 'o', 'ò': 'o',
    'ē': 'e', 'é': 'e', 'ě': 'e', 'è': 'e',
    'ī': 'i', 'í': 'i', 'ǐ': 'i', 'ì': 'i',
    'ū': 'u', 'ú': 'u', 'ǔ': 'u', 'ù': 'u',
    'ü': 'v', 'ǖ': 'v', 'ǘ': 'v', 'ǚ': 'v', 'ǜ': 'v',
    'ń': 'n', 'ň': 'n', 'ǹ': 'n',
    'Ā': 'A', 'Á': 'A', 'Ǎ': 'A', 'À': 'A',
    'Ō': 'O', 'Ó': 'O', 'Ǒ': 'O', 'Ò': 'O',
    'Ē': 'E', 'É': 'E', 'Ě': 'E', 'È': 'E',
    'Ī': 'I', 'Í': 'I', 'Ǐ': 'I', 'Ì': 'I',
    'Ū': 'U', 'Ú': 'U', 'ǔ': 'U', 'Ù': 'U',
    'Ü': 'V', 'Ǖ': 'V', 'Ǘ': 'V', 'Ǚ': 'V', 'Ǜ': 'V'
};

function removeTones(pinyin) {
    if (!pinyin) return '';
    return pinyin.split('').map(char => toneMap[char] || char).join('').replace(/\s+/g, '').toLowerCase();
}

function download(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

async function main() {
    try {
        console.log('Fetching hsk.json...');
        const data = await download('https://raw.githubusercontent.com/LiudmilaLV/json_hsk/master/hsk.json');
        const hskData = JSON.parse(data);
        
        // Group by level
        const levels = {};
        hskData.forEach(item => {
            const level = item.level;
            if (!levels[level]) levels[level] = [];
            
            levels[level].push({
                name: removeTones(item.pinyin),
                trans: item.translations.eng,
                notation: item.hanzi,
                usphone: '',
                ukphone: ''
            });
        });

        // Save each level
        for (const level in levels) {
            const filename = `HSK_${level}_All.json`;
            const filePath = path.join(dictsDir, filename);
            fs.writeFileSync(filePath, JSON.stringify(levels[level], null, 2));
            console.log(`Saved ${filename} (${levels[level].length} items)`);
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

main();
