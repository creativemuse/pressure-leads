"use client"

import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from "react"
import { motion, AnimatePresence } from "motion/react"

import "./RotatingText.css"

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}

export interface RotatingTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  texts: string[]
  transition?: { type?: "spring" | "tween"; damping?: number; stiffness?: number }
  initial?: { y?: string | number; opacity?: number }
  animate?: { y?: number; opacity?: number }
  exit?: { y?: string | number; opacity?: number }
  animatePresenceMode?: "wait" | "sync" | "popLayout"
  animatePresenceInitial?: boolean
  rotationInterval?: number
  staggerDuration?: number
  staggerFrom?: "first" | "last" | "center" | "random" | number
  loop?: boolean
  auto?: boolean
  splitBy?: "characters" | "words" | "lines" | string
  onNext?: (index: number) => void
  mainClassName?: string
  splitLevelClassName?: string
  elementLevelClassName?: string
}

const RotatingText = forwardRef<{ next: () => void; previous: () => void; jumpTo: (index: number) => void; reset: () => void }, RotatingTextProps>((props, ref) => {
  const {
    texts,
    transition = { type: "spring", damping: 25, stiffness: 300 },
    initial = { y: "100%", opacity: 0 },
    animate = { y: 0, opacity: 1 },
    exit = { y: "-120%", opacity: 0 },
    animatePresenceMode = "wait",
    animatePresenceInitial = false,
    rotationInterval = 2000,
    staggerDuration = 0,
    staggerFrom = "first",
    loop = true,
    auto = true,
    splitBy = "characters",
    onNext,
    mainClassName,
    splitLevelClassName,
    elementLevelClassName,
    ...rest
  } = props

  const [currentTextIndex, setCurrentTextIndex] = useState(0)

  const splitIntoCharacters = (text: string) => {
    if (typeof Intl !== "undefined" && Intl.Segmenter) {
      const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" })
      return Array.from(segmenter.segment(text), (segment) => segment.segment)
    }
    return Array.from(text)
  }

  const elements = useMemo(() => {
    const currentText = texts[currentTextIndex]
    if (splitBy === "characters") {
      const words = currentText.split(" ")
      return words.map((word, i) => ({
        characters: splitIntoCharacters(word),
        needsSpace: i !== words.length - 1,
      }))
    }
    if (splitBy === "words") {
      return currentText.split(" ").map((word, i, arr) => ({
        characters: [word],
        needsSpace: i !== arr.length - 1,
      }))
    }
    if (splitBy === "lines") {
      return currentText.split("\n").map((line, i, arr) => ({
        characters: [line],
        needsSpace: i !== arr.length - 1,
      }))
    }

    return currentText.split(splitBy).map((part, i, arr) => ({
      characters: [part],
      needsSpace: i !== arr.length - 1,
    }))
  }, [texts, currentTextIndex, splitBy])

  const getStaggerDelay = useCallback(
    (index: number, totalChars: number) => {
      const total = totalChars
      if (staggerFrom === "first") return index * staggerDuration
      if (staggerFrom === "last") return (total - 1 - index) * staggerDuration
      if (staggerFrom === "center") {
        const center = Math.floor(total / 2)
        return Math.abs(center - index) * staggerDuration
      }
      if (staggerFrom === "random") {
        const randomIndex = Math.floor(Math.random() * total)
        return Math.abs(randomIndex - index) * staggerDuration
      }
      return Math.abs(staggerFrom - index) * staggerDuration
    },
    [staggerFrom, staggerDuration],
  )

  const handleIndexChange = useCallback(
    (newIndex: number) => {
      setCurrentTextIndex(newIndex)
      if (onNext) onNext(newIndex)
    },
    [onNext],
  )

  const next = useCallback(() => {
    const nextIndex = currentTextIndex === texts.length - 1 ? (loop ? 0 : currentTextIndex) : currentTextIndex + 1
    if (nextIndex !== currentTextIndex) {
      handleIndexChange(nextIndex)
    }
  }, [currentTextIndex, texts.length, loop, handleIndexChange])

  const previous = useCallback(() => {
    const prevIndex = currentTextIndex === 0 ? (loop ? texts.length - 1 : currentTextIndex) : currentTextIndex - 1
    if (prevIndex !== currentTextIndex) {
      handleIndexChange(prevIndex)
    }
  }, [currentTextIndex, texts.length, loop, handleIndexChange])

  const jumpTo = useCallback(
    (index: number) => {
      const validIndex = Math.max(0, Math.min(index, texts.length - 1))
      if (validIndex !== currentTextIndex) {
        handleIndexChange(validIndex)
      }
    },
    [texts.length, currentTextIndex, handleIndexChange],
  )

  const reset = useCallback(() => {
    if (currentTextIndex !== 0) {
      handleIndexChange(0)
    }
  }, [currentTextIndex, handleIndexChange])

  useImperativeHandle(
    ref,
    () => ({
      next,
      previous,
      jumpTo,
      reset,
    }),
    [next, previous, jumpTo, reset],
  )

  useEffect(() => {
    if (!auto) return
    const intervalId = setInterval(next, rotationInterval)
    return () => clearInterval(intervalId)
  }, [next, rotationInterval, auto])

  const motionTransition = { ...transition, type: (transition?.type ?? "spring") as "spring" }
  const motionInitial = initial as React.ComponentProps<typeof motion.span>["initial"]
  const motionAnimate = animate as React.ComponentProps<typeof motion.span>["animate"]
  const motionExit = exit as React.ComponentProps<typeof motion.span>["exit"]

  return (
    <motion.span
      className={cn("text-rotate", mainClassName)}
      layout
      transition={motionTransition}
      {...(rest as React.ComponentProps<typeof motion.span>)}
    >
      <span className="text-rotate-sr-only">{texts[currentTextIndex]}</span>
      <AnimatePresence mode={animatePresenceMode} initial={animatePresenceInitial}>
        <motion.span
          key={currentTextIndex}
          className={cn(splitBy === "lines" ? "text-rotate-lines" : "text-rotate")}
          layout
          aria-hidden="true"
        >
          {elements.map((wordObj, wordIndex, array) => {
            const previousCharsCount = array.slice(0, wordIndex).reduce((sum, word) => sum + word.characters.length, 0)
            return (
              <span key={wordIndex} className={cn("text-rotate-word", splitLevelClassName)}>
                {wordObj.characters.map((char: string, charIndex: number) => (
                  <motion.span
                    key={charIndex}
                    initial={motionInitial}
                    animate={motionAnimate}
                    exit={motionExit}
                    transition={{
                      ...motionTransition,
                      delay: getStaggerDelay(
                        previousCharsCount + charIndex,
                        array.reduce((sum, word) => sum + word.characters.length, 0),
                      ),
                    }}
                    className={cn("text-rotate-element", elementLevelClassName)}
                  >
                    {char}
                  </motion.span>
                ))}
                {wordObj.needsSpace && <span className="text-rotate-space"> </span>}
              </span>
            )
          })}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  )
})

RotatingText.displayName = "RotatingText"
export default RotatingText
