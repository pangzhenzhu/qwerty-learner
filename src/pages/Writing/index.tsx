import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Header from '@/components/Header';
import HanziWriterComponent from '@/components/HanziWriter';
import { wordListFetcher } from '@/utils/wordListFetcher';
import useSWR from 'swr';
import { Word } from '@/typings/index';
import IconPencil from '~icons/tabler/pencil';
import IconVolume from '~icons/tabler/volume';

const HSK_DICTS = [
  { id: 'hsk3', name: 'HSK 3', url: '/dicts/HSK_3_All.json' },
  { id: 'hsk4', name: 'HSK 4', url: '/dicts/HSK_4_All.json' },
  { id: 'hsk5', name: 'HSK 5', url: '/dicts/HSK_5_All.json' },
  { id: 'hsk6', name: 'HSK 6', url: '/dicts/HSK_6_All.json' },
];

export default function WritingPage() {
  const [currentDict, setCurrentDict] = useState(HSK_DICTS[0]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [subCharIndex, setSubCharIndex] = useState(0);
  const { data: wordList, error } = useSWR<Word[]>(currentDict.url, wordListFetcher);

  const currentWord = wordList ? wordList[currentIndex] : null;

  useEffect(() => {
    setSubCharIndex(0);
  }, [currentIndex, currentDict]);

  const handleNext = () => {
    if (wordList && currentIndex < wordList.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleDictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const dict = HSK_DICTS.find(d => d.id === e.target.value);
    if (dict) {
      setCurrentDict(dict);
      setCurrentIndex(0);
    }
  };

  const characters = currentWord?.notation ? currentWord.notation.split('') : [];

  return (
    <Layout>
      <Header>
        <div className="flex items-center gap-2 text-indigo-500 font-bold text-xl">
            <IconPencil />
            <span>汉字书写练习</span>
        </div>
      </Header>
      
      <div className="container mx-auto flex flex-col items-center justify-center flex-1 gap-8 py-10">
        
        <div className="flex items-center gap-4">
          <label className="font-bold text-gray-700 dark:text-gray-200">选择等级:</label>
          <select 
            className="p-2 rounded border border-gray-300 dark:bg-gray-800 dark:text-white"
            value={currentDict.id}
            onChange={handleDictChange}
          >
            {HSK_DICTS.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
          <span className="text-gray-500 text-sm">
            ({currentIndex + 1} / {wordList?.length || 0})
          </span>
        </div>

        {error && <div className="text-red-500">Failed to load dictionary</div>}
        {!wordList && <div className="text-gray-500">Loading...</div>}

        {currentWord && characters.length > 0 && (
          <div className="flex flex-col items-center gap-6 p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg min-w-[300px]">
            
            <div className="flex flex-col items-center">
               {/* Display Pinyin */}
               <div className="text-2xl font-mono text-indigo-500 mb-2 flex items-center gap-2">
                 {currentWord.name}
                 <button 
                   onClick={() => {
                     const audio = new Audio(`https://dict.youdao.com/dictvoice?audio=${currentWord.notation || currentWord.name}&le=zh`);
                     audio.play();
                   }} 
                   className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
                   title="播放读音"
                 >
                    <IconVolume className="w-6 h-6" />
                 </button>
               </div>

               {/* Character Selection Tabs */}
               {characters.length > 1 && (
                 <div className="flex gap-2 mb-4">
                   {characters.map((char, idx) => (
                     <button
                       key={idx}
                       onClick={() => setSubCharIndex(idx)}
                       className={`w-10 h-10 rounded-lg text-lg font-bold transition-colors ${
                         idx === subCharIndex 
                           ? 'bg-indigo-500 text-white' 
                           : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                       }`}
                     >
                       {char}
                     </button>
                   ))}
                 </div>
               )}
               
               {/* Hanzi Writer */}
               <HanziWriterComponent 
                 character={characters[subCharIndex]} 
                 size={250}
               />
               
               {/* Translations */}
               <div className="mt-6 text-center text-gray-600 dark:text-gray-300 max-w-md">
                 {Array.isArray(currentWord.trans) ? currentWord.trans.join(', ') : currentWord.trans}
               </div>
            </div>

            <div className="flex gap-4 mt-4">
              <button 
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
              >
                Previous
              </button>
              <button 
                onClick={handleNext}
                disabled={!wordList || currentIndex === wordList.length - 1}
                className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 disabled:opacity-50"
              >
                Next
              </button>
            </div>

          </div>
        )}
      </div>
    </Layout>
  );
}
