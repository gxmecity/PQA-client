import React, { useEffect, useRef, useState } from 'react'
import Question from './Question'
import { quizzes } from '@/data'
import Answer from './Answer'

type Props = {
  data: Round
  onRoundEnded: () => void
}

export default function Trivia({ data, onRoundEnded }: Props) {
  const [activeQuestionIndex, setactiveQuestionIndex] = useState<number>(0)
  const [finishedQuestion, setFinishedQuestion] = useState<boolean>(false)
  const [revealAnswer, setRevealAnswer] = useState<boolean>(false)

  const isLastQuestion = activeQuestionIndex === data.questions.length - 1

  const handleTimeComplete = () => {
    if (isLastQuestion) {
      setFinishedQuestion(true)
      setactiveQuestionIndex(0)
      return
    }
    setactiveQuestionIndex((prev) => prev + 1)
  }

  const goToNextQuestion = () => {
    if (isLastQuestion) {
      onRoundEnded()
      return
    }

    setRevealAnswer(false)
    setactiveQuestionIndex((prev) => prev + 1)
  }

  if (revealAnswer)
    return (
      <Answer
        data={data.questions[activeQuestionIndex].answer}
        isLastQuestion={isLastQuestion}
        goToNext={goToNextQuestion}
      />
    )

  return (
    <Question
      data={data.questions[activeQuestionIndex]}
      onTimeComplete={handleTimeComplete}
      timer={20}
      questionNumber={activeQuestionIndex + 1}
      shouldRevealAnswer={finishedQuestion}
      shouldCounntdown={!finishedQuestion}
      isLastQuestion={isLastQuestion}
      goToNext={() => setRevealAnswer(true)}
    />
  )
}
