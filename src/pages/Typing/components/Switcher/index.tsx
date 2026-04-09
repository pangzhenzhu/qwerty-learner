import { TypingContext, TypingStateActionType } from '../../store'
import AnalysisButton from '../AnalysisButton'
import ErrorBookButton from '../ErrorBookButton'
import HandPositionIllustration from '../HandPositionIllustration'
import LoopWordSwitcher from '../LoopWordSwitcher'
import Setting from '../Setting'
import SoundSwitcher from '../SoundSwitcher'
import WordDictationSwitcher from '../WordDictationSwitcher'
import WritingButton from '../WritingButton'
import Tooltip from '@/components/Tooltip'
import { isOpenDarkModeAtom } from '@/store'
import { CTRL } from '@/utils'
import { useAtom } from 'jotai'
import { useContext } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import IconMoon from '~icons/heroicons/moon-solid'
import IconSun from '~icons/heroicons/sun-solid'
import IconLanguage from '~icons/tabler/language'
import IconLanguageOff from '~icons/tabler/language-off'

export default function Switcher() {
  const [isOpenDarkMode, setIsOpenDarkMode] = useAtom(isOpenDarkModeAtom)
  const { state, dispatch } = useContext(TypingContext) ?? {}

  const changeDarkModeState = () => {
    setIsOpenDarkMode((old) => !old)
  }

  const changeTransVisibleState = () => {
    if (dispatch) {
      dispatch({ type: TypingStateActionType.TOGGLE_TRANS_VISIBLE })
    }
  }

  useHotkeys(
    'ctrl+shift+v',
    () => {
      changeTransVisibleState()
    },
    { enableOnFormTags: true, preventDefault: true },
    [],
  )

  return (
    <div className="flex items-center justify-center gap-2">
      <Tooltip content="Sound Settings">
        <SoundSwitcher />
      </Tooltip>

      <Tooltip className="h-7 w-7" content="Word Loop Settings">
        <LoopWordSwitcher />
      </Tooltip>

      <Tooltip className="h-7 w-7" content={`Toggle Dictation Mode (${CTRL} + V)`}>
        <WordDictationSwitcher />
      </Tooltip>
      <Tooltip className="h-7 w-7" content={`Toggle Translation (${CTRL} + Shift + V)`}>
        <button
          className={`p-[2px] ${state?.isTransVisible ? 'text-orange-500' : 'text-gray-500'} text-lg focus:outline-none`}
          type="button"
          onClick={(e) => {
            changeTransVisibleState()
            e.currentTarget.blur()
          }}
          aria-label={`Toggle Translation (${CTRL} + Shift + V)`}
        >
          {state?.isTransVisible ? <IconLanguage /> : <IconLanguageOff />}
        </button>
      </Tooltip>

      <Tooltip content="Error Book">
        <ErrorBookButton />
      </Tooltip>

      <Tooltip className="h-7 w-7" content="View Statistics">
        <AnalysisButton />
      </Tooltip>

      <Tooltip className="h-7 w-7" content="Hanzi Writing Practice">
        <WritingButton />
      </Tooltip>

      <Tooltip className="h-7 w-7" content="Toggle Dark Mode">
        <button
          className={`p-[2px] text-lg text-orange-500 focus:outline-none`}
          type="button"
          onClick={(e) => {
            changeDarkModeState()
            e.currentTarget.blur()
          }}
          aria-label="Toggle Dark Mode"
        >
          {isOpenDarkMode ? <IconMoon className="icon" /> : <IconSun className="icon" />}
        </button>
      </Tooltip>
      <Tooltip className="h-7 w-7" content="Typing Hand Position">
        <HandPositionIllustration></HandPositionIllustration>
      </Tooltip>
      <Tooltip content="Settings">
        <Setting />
      </Tooltip>
    </div>
  )
}
