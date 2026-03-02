import HanziWriterComponent from '@/components/HanziWriter'
import Header from '@/components/Header'
import Layout from '@/components/Layout'
import type { Word } from '@/typings/index'
import { wordListFetcher } from '@/utils/wordListFetcher'
import type React from 'react'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import IconPencil from '~icons/tabler/pencil'
import IconVolume from '~icons/tabler/volume'

const HSK_DICTS = [
  { id: 'hsk3', name: 'HSK 3', url: '/dicts/HSK_3_All.json' },
  { id: 'hsk4', name: 'HSK 4', url: '/dicts/HSK_4_All.json' },
  { id: 'hsk5', name: 'HSK 5', url: '/dicts/HSK_5_All.json' },
  { id: 'hsk6', name: 'HSK 6', url: '/dicts/HSK_6_All.json' },
]

export default function WritingPage() {
  const [currentDict, setCurrentDict] = useState(HSK_DICTS[0])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [subCharIndex, setSubCharIndex] = useState(0)
  const { data: wordList, error } = useSWR<Word[]>(currentDict.url, wordListFetcher)

  const currentWord = wordList ? wordList[currentIndex] : null

  useEffect(() => {
    setSubCharIndex(0)
  }, [currentIndex, currentDict])

  const handleNext = () => {
    if (wordList && currentIndex < wordList.length - 1) {
      setCurrentIndex((prev) => prev + 1)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
    }
  }

  const handleDictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const dict = HSK_DICTS.find((d) => d.id === e.target.value)
    if (dict) {
      setCurrentDict(dict)
      setCurrentIndex(0)
    }
  }

  const characters = currentWord?.notation ? currentWord.notation.split('') : []

  return (
    <Layout>
      <Header>
        <div className="flex items-center gap-2 text-xl font-bold text-indigo-500">
          <IconPencil />
          <span>汉字书写练习</span>
        </div>
      </Header>

      <div className="container mx-auto flex flex-1 flex-col items-center justify-center gap-8 py-10">
        <div className="flex items-center gap-4">
          <label className="font-bold text-gray-700 dark:text-gray-200">选择等级:</label>
          <select
            className="rounded border border-gray-300 p-2 dark:bg-gray-800 dark:text-white"
            value={currentDict.id}
            onChange={handleDictChange}
          >
            {HSK_DICTS.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-500">
            ({currentIndex + 1} / {wordList?.length || 0})
          </span>
        </div>

        {error && <div className="text-red-500">Failed to load dictionary</div>}
        {!wordList && <div className="text-gray-500">Loading...</div>}

        {currentWord && characters.length > 0 && (
          <div className="flex min-w-[300px] flex-col items-center gap-6 rounded-2xl bg-white p-8 shadow-lg dark:bg-gray-800">
            <div className="flex flex-col items-center">
              {/* Display Pinyin */}
              <div className="mb-2 flex items-center gap-2 font-mono text-2xl text-indigo-500">
                {currentWord.name}
                <button
                  onClick={() => {
                    const audio = new Audio(`https://dict.youdao.com/dictvoice?audio=${currentWord.notation || currentWord.name}&le=zh`)
                    audio.play()
                  }}
                  className="rounded-full p-1 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                  title="播放读音"
                >
                  <IconVolume className="h-6 w-6" />
                </button>
              </div>

              {/* Character Selection Tabs */}
              {characters.length > 1 && (
                <div className="mb-4 flex gap-2">
                  {characters.map((char, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSubCharIndex(idx)}
                      className={`h-10 w-10 rounded-lg text-lg font-bold transition-colors ${
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
              <HanziWriterComponent character={characters[subCharIndex]} size={250} />

              {/* Translations */}
              <div className="mt-6 max-w-md text-center text-gray-600 dark:text-gray-300">
                {Array.isArray(currentWord.trans) ? currentWord.trans.join(', ') : currentWord.trans}
              </div>
            </div>

            <div className="mt-4 flex gap-4">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300 disabled:opacity-50 dark:bg-gray-700 dark:hover:bg-gray-600"
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                disabled={!wordList || currentIndex === wordList.length - 1}
                className="rounded bg-indigo-500 px-4 py-2 text-white hover:bg-indigo-600 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
