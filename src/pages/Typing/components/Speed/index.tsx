import { TypingContext } from '../../store'
import InfoBox from './InfoBox'
import { currentDictInfoAtom } from '@/store'
import { useAtomValue } from 'jotai'
import { useContext } from 'react'

export default function Speed() {
  // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
  const { state } = useContext(TypingContext)!
  const currentDictInfo = useAtomValue(currentDictInfoAtom)
  const seconds = state.timerData.time % 60
  const minutes = Math.floor(state.timerData.time / 60)
  const secondsString = seconds < 10 ? '0' + seconds : seconds + ''
  const minutesString = minutes < 10 ? '0' + minutes : minutes + ''

  const isChineseEntryStats = currentDictInfo.languageCategory === 'zh'
  const correctNumber = isChineseEntryStats ? state.chapterData.itemCorrectCount : state.chapterData.correctCount

  return (
    <div className="my-card flex w-3/5 rounded-xl bg-white p-4 py-10 opacity-50 transition-colors duration-300 dark:bg-gray-800">
      <InfoBox info={`${minutesString}:${secondsString}`} description="Time" />
      <InfoBox info={state.chapterData.correctCount + state.chapterData.wrongCount + ''} description="Inputs" />
      <InfoBox info={state.timerData.wpm + ''} description="WPM" />
      <InfoBox info={correctNumber + ''} description="Correct" />
      <InfoBox info={state.timerData.accuracy + ''} description="Accuracy" />
    </div>
  )
}
