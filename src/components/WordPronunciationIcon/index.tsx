import { SoundIcon } from './SoundIcon'
import usePronunciationSound from '@/hooks/usePronunciation'
import type { Word } from '@/typings'
import { useCallback, useEffect, useImperativeHandle, useState } from 'react'
import React from 'react'

export const WordPronunciationIcon = React.forwardRef<
  WordPronunciationIconRef,
  { word: Word; lang: string; className?: string; iconClassName?: string }
>(({ word, lang, className, iconClassName }, ref) => {
  const [isTTSPlaying, setIsTTSPlaying] = useState(false)
  const currentWord = () => {
    if (lang === 'hapin') {
      if (/[\u0400-\u04FF]/.test(word.notation || '')) {
        // 哈萨克语西里尔文字
        return word.notation || ''
      } else {
        // 哈萨克语老文字
        return word.trans[2]
      }
    } else if (lang === 'chinese') {
      return word.notation || word.name
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

    if (lang === 'chinese' && word.notation) {
      // Replace Word(Phonetic) with Phonetic for TTS
      const textToSpeak = word.notation.replace(/(.+?)[(（](.+?)[)）]/g, '$2')
      const u = new SpeechSynthesisUtterance(textToSpeak)
      u.lang = 'zh-CN'
      u.onstart = () => setIsTTSPlaying(true)
      u.onend = () => setIsTTSPlaying(false)
      u.onerror = () => setIsTTSPlaying(false)
      window.speechSynthesis.speak(u)
    } else {
      play()
    }
  }, [play, stop, lang, word])

  useEffect(() => {
    return () => {
      stop()
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }
    }
  }, [word, stop])

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
      className={`cursor-pointer text-gray-600 ${className}`}
      iconClassName={iconClassName}
    />
  )
})

WordPronunciationIcon.displayName = 'WordPronunciationIcon'

export type WordPronunciationIconRef = {
  play: () => void
}
