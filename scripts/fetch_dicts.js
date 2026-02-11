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
        console.log('Fetching idiom.json...');
        const idiomData = await download('https://raw.githubusercontent.com/pwxcoo/chinese-xinhua/master/data/idiom.json');
        const idioms = JSON.parse(idiomData);
        
        const chengyuList = idioms.map(item => ({
            name: removeTones(item.pinyin),
            trans: [item.explanation],
            notation: item.word,
            usphone: '',
            ukphone: ''
        }));
        
        fs.writeFileSync(path.join(dictsDir, 'Chengyu_All.json'), JSON.stringify(chengyuList.slice(0, 10000), null, 2));
        console.log(`Saved Chengyu_All.json (${chengyuList.length} items, limited to 10000)`);

        console.log('Fetching word.json...');
        const wordData = await download('https://raw.githubusercontent.com/pwxcoo/chinese-xinhua/master/data/word.json');
        const words = JSON.parse(wordData);
        
        const xinhuaList = words.map(item => ({
            name: removeTones(item.pinyin),
            trans: [item.explanation],
            notation: item.word,
            usphone: '',
            ukphone: ''
        }));
        
        fs.writeFileSync(path.join(dictsDir, 'Xinhua_All.json'), JSON.stringify(xinhuaList.slice(0, 10000), null, 2));
        console.log(`Saved Xinhua_All.json (${xinhuaList.length} items, limited to 10000)`);

    } catch (error) {
        console.error('Error:', error);
    }
}

main();
