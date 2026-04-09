import { SoundIcon } from './SoundIcon'
import usePronunciationSound from '@/hooks/usePronunciation'
import { pronunciationConfigAtom } from '@/store'
import type { Word } from '@/typings'
import { useAtomValue } from 'jotai'
import { useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import React from 'react'

export const WordPronunciationIcon = React.forwardRef<
  WordPronunciationIconRef,
  { word: Word; lang: string; className?: string; iconClassName?: string }
>(({ word, lang, className, iconClassName }, ref) => {
  const [isTTSPlaying, setIsTTSPlaying] = useState(false)
  const pronunciationConfig = useAtomValue(pronunciationConfigAtom)
  const isChineseLang = lang === 'chinese' || lang === 'zh'
  const ttsUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const currentWord = () => {
    if (lang === 'hapin') {
      if (/[\u0400-\u04FF]/.test(word.notation || '')) {
        return word.notation || ''
      } else {
        return word.trans[2]
      }
    } else if (isChineseLang) {
      return (word.notation || '').replace(/[（(].*?[)）]/g, '').trim() || word.name
    } else {
      return word.name
    }
  }
  const { play, stop, isPlaying } = usePronunciationSound(currentWord())

  const playSound = useCallback(() => {
    stop()
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }

    if (isChineseLang && word.notation && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const textToSpeak = word.notation.replace(/(.+?)[(（](.+?)[)）]/g, '$2')
      const u = new SpeechSynthesisUtterance(textToSpeak)
      u.lang = 'zh-CN'
      ttsUtteranceRef.current = u
      u.onstart = () => setIsTTSPlaying(true)
      u.onend = () => {
        setIsTTSPlaying(false)
        if (
          pronunciationConfig.isOpen &&
          pronunciationConfig.isLoop &&
          ttsUtteranceRef.current === u &&
          typeof window !== 'undefined' &&
          'speechSynthesis' in window
        ) {
          window.speechSynthesis.speak(u)
        }
      }
      u.onerror = () => setIsTTSPlaying(false)
      window.speechSynthesis.speak(u)
    } else {
      play()
    }
  }, [play, stop, isChineseLang, word, pronunciationConfig.isLoop, pronunciationConfig.isOpen])

  useEffect(() => {
    return () => {
      ttsUtteranceRef.current = null
      stop()
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }
    }
  }, [word, stop])

  useEffect(() => {
    if (pronunciationConfig.isOpen) return
    ttsUtteranceRef.current = null
    stop()
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
    setIsTTSPlaying(false)
  }, [pronunciationConfig.isOpen, stop])

  useImperativeHandle(
    ref,
    () => ({
      play: playSound,
    }),
    [playSound],
  )

  return (
    <SoundIcon
      animated={isPlaying || isTTSPlaying}
      onClick={playSound}
      className={`cursor-pointer text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 ${className}`}
      iconClassName={iconClassName}
    />
  )
})

WordPronunciationIcon.displayName = 'WordPronunciationIcon'

export type WordPronunciationIconRef = {
  play: () => void
}
