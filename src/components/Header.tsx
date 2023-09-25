'use client'

import React from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'
import { Button } from './Button'

interface UserAnswersProps {
  correctAnswer: string
  selectedAnswer: string
  timeAnswered: number
}

interface HeaderProps {
  userAnswers?: UserAnswersProps[]
  setUserAnswers: (userAnswers: UserAnswersProps[]) => void
}

export const Header: React.FC<HeaderProps> = ({
  userAnswers,
  setUserAnswers,
}) => {
  const calculateContrastRatio = (background: string, text: string) => {
    if (!background || !text) {
      return 'black'
    }

    const getLuminance = (color: string) => {
      const matchResult = color.match(/\d+/g)
      if (matchResult) {
        const rgb = matchResult.map(Number)
        const [r, g, b] = rgb.map((value, index) => {
          value /= 255
          value =
            value <= 0.03928
              ? value / 12.92
              : Math.pow((value + 0.055) / 1.055, 2.4)
          return index === 0
            ? 0.2126 * value
            : index === 1
            ? 0.7152 * value
            : 0.0722 * value
        })
        return r + g + b
      }

      return 0
    }

    const backgroundLuminance = getLuminance(background)
    const textLuminance = getLuminance(text)

    const backgroundLuminanceThreshold = 0.2

    const isDarkBackground = backgroundLuminance < backgroundLuminanceThreshold

    if (isDarkBackground) {
      return 'white'
    }

    const contrastRatio =
      (Math.max(backgroundLuminance, textLuminance) + 0.05) /
      (Math.min(backgroundLuminance, textLuminance) + 0.05)

    return contrastRatio >= 4.5 ? 'white' : 'black'
  }

  return (
    <div className="h-screen w-96 bg-slate-300 p-3 flex flex-col">
      <div className="flex items-center justify-center mt-3 mb-3">
        <h1>Current/Latest Game</h1>
      </div>
      <div className="flex flex-row items-center justify-center p-6">
        <span>Guessed Color</span>
        <span>Correct Color</span>
        <span>Score</span>
      </div>

      <div className="overflow-y-auto h-4/5 py-4">
        {userAnswers?.map((userAnswer, index) => (
          <div key={index} className="flex w-full justify-between">
            {userAnswer.correctAnswer === userAnswer.selectedAnswer ? (
              <div className="flex justify-between items-center h-7 w-full mb-4 px-6 ml-10">
                <div
                  className="p-2 rounded-lg"
                  style={{
                    backgroundColor: `${userAnswer.correctAnswer}`,
                    color: calculateContrastRatio(
                      userAnswer.correctAnswer,
                      'white',
                    ),
                  }}
                >
                  <p
                    className="text-black font-bold"
                    style={{
                      color: calculateContrastRatio(
                        userAnswer.correctAnswer,
                        'white',
                      ),
                    }}
                  >
                    {userAnswer.correctAnswer}
                  </p>
                </div>
                <div className="flex flex-row ml-2">
                  <span className="mr-2">{userAnswer.timeAnswered}s</span>
                  <CheckCircle2 color="green" />
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center h-7 w-full mb-4 px-6">
                <div
                  className="p-2 rounded-lg"
                  style={{
                    backgroundColor: `${userAnswer.selectedAnswer}`,
                    color: calculateContrastRatio(
                      userAnswer.selectedAnswer,
                      'white',
                    ),
                  }}
                >
                  <p
                    className="text-black font-bold"
                    style={{
                      color: calculateContrastRatio(
                        userAnswer.selectedAnswer,
                        'white',
                      ),
                    }}
                  >
                    {userAnswer.correctAnswer}
                  </p>
                </div>
                <div
                  className="p-2 rounded-lg ml-2"
                  style={{
                    backgroundColor: `${userAnswer.correctAnswer}`,
                    color: calculateContrastRatio(
                      userAnswer.correctAnswer,
                      'white',
                    ),
                  }}
                >
                  <p
                    className="text-black font-bold"
                    style={{
                      color: calculateContrastRatio(
                        userAnswer.correctAnswer,
                        'white',
                      ),
                    }}
                  >
                    {userAnswer.correctAnswer}
                  </p>
                </div>
                <div className="flex flex-row ml-2">
                  <span className="mr-2">{userAnswer.timeAnswered}s</span>
                  <XCircle color="red" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-center items-center p-12">
        <Button onClick={() => setUserAnswers([])}>Limpar dados</Button>
      </div>
    </div>
  )
}
