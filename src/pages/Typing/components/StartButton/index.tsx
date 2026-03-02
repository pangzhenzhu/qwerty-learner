import { TypingContext, TypingStateActionType } from '../../store'
import Tooltip from '@/components/Tooltip'
import { randomConfigAtom } from '@/store'
import { autoUpdate, offset, useFloating, useHover, useInteractions } from '@floating-ui/react'
import { useAtomValue } from 'jotai'
import { useCallback, useContext, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import IconPlayerPause from '~icons/tabler/player-pause'
import IconPlayerPlay from '~icons/tabler/player-play'
import IconRotate from '~icons/tabler/rotate'

export default function StartButton({ isLoading }: { isLoading: boolean }) {
  // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
  const { state, dispatch } = useContext(TypingContext)!
  const randomConfig = useAtomValue(randomConfigAtom)

  const onToggleIsTyping = useCallback(() => {
    !isLoading && dispatch({ type: TypingStateActionType.TOGGLE_IS_TYPING })
  }, [isLoading, dispatch])

  const onClickRestart = useCallback(() => {
    dispatch({ type: TypingStateActionType.REPEAT_CHAPTER, shouldShuffle: randomConfig.isOpen })
  }, [dispatch, randomConfig.isOpen])

  useHotkeys('enter', onToggleIsTyping, { enableOnFormTags: true, preventDefault: true }, [onToggleIsTyping])

  const [isShowReStartButton, setIsShowReStartButton] = useState(false)
  const { refs, context } = useFloating({
    open: isShowReStartButton,
    onOpenChange: setIsShowReStartButton,
    whileElementsMounted: autoUpdate,
    middleware: [offset(5)],
  })
  const hoverButton = useHover(context)
  const { getReferenceProps, getFloatingProps } = useInteractions([hoverButton])

  return (
    <Tooltip content={`${state.isTyping ? '暂停' : '开始'} （Enter）`} className="h-7 w-7">
      <div ref={refs.setReference} {...getReferenceProps()} className="relative flex items-center justify-center">
        <button
          className={`rounded p-[2px] text-lg transition-colors duration-300 ease-in-out hover:bg-indigo-400 hover:text-white focus:outline-none ${
            state.isTyping ? 'text-gray-600 dark:text-gray-400' : 'text-indigo-500'
          }`}
          type="button"
          onClick={onToggleIsTyping}
          aria-label={state.isTyping ? '暂停' : '开始'}
        >
          {state.isTyping ? <IconPlayerPause /> : <IconPlayerPlay />}
        </button>
        {isShowReStartButton && (
          <div
            className="absolute left-1/2 top-full z-50 mt-1 flex -translate-x-1/2 justify-center"
            ref={refs.setFloating}
            {...getFloatingProps()}
          >
            <Tooltip content="重新开始" placement="bottom">
              <button
                className="rounded-full bg-white p-1 text-indigo-500 shadow-md hover:text-indigo-600 dark:bg-gray-800"
                type="button"
                onClick={onClickRestart}
                aria-label="重新开始"
              >
                <IconRotate className="h-4 w-4" />
              </button>
            </Tooltip>
          </div>
        )}
      </div>
    </Tooltip>
  )
}
