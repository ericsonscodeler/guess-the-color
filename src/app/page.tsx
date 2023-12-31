'use client'

import React, { useState, useEffect, useRef } from 'react'

import { differenceInSeconds } from 'date-fns'
import { SideBar } from '@/components/SideBar'
import axios from 'axios'
import { regexValidate } from '@/lib/regex'
import { Ranking } from '@/components/Ranking'
import { LevelProps, UserAnswersProps, RankingProps } from './types'
import dayjs from 'dayjs'

const TIME = 30

const typeLevel = [
  {
    nivel: 'Fácil',
    quantityOptions: 3,
  },
  {
    nivel: 'Médio',
    quantityOptions: 4,
  },
  {
    nivel: 'Difício',
    quantityOptions: 5,
  },
]

export default function Home() {
  const [color, setColor] = useState<string>('')
  const [level, setLevel] = useState<LevelProps>({
    nivel: 'Fácil',
    quantityOptions: 3,
  })
  const [answers, setAnswers] = useState<string[]>([])
  const [userAnswers, setUserAnswers] = useState<UserAnswersProps[]>([])
  const [playing, setPlaying] = useState<boolean>(false)
  const [startTimer, setStartTimer] = useState<Date>()
  const [secondsPassed, setSecondsPassed] = useState<number>(TIME)
  const [ranking, setRanking] = useState<RankingProps[]>([])
  const [player, setPlayer] = useState<string>('')
  const [highscore, setHighscore] = useState<number>(0)
  const [score, setScore] = useState<number>(0)
  const [messageNameError, setMessageNameError] = useState<string>('')
  const [timeSinceLastQuestion, setTimeSinceLastQuestion] = useState<number>(0)

  const refColor = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let interval: ReturnType<typeof setTimeout>

    if (startTimer) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(),
          new Date(startTimer),
        )

        setSecondsPassed(TIME - secondsDifference)

        if (secondsDifference >= TIME) {
          handleSubmitPlayer()
          listRanking()
          setPlaying(false)
          clearInterval(interval)
        } else {
          setTimeSinceLastQuestion(
            (secondsSinceLastQuestion) => secondsSinceLastQuestion + 1,
          )

          if (timeSinceLastQuestion >= 10) {
            setScore((prevScore) => prevScore - 2)
            nextQuestion()
          }
        }
      }, 1000)
    }

    return () => {
      clearInterval(interval)
    }
  }, [startTimer, timeSinceLastQuestion])

  useEffect(() => {
    listRanking()
  }, [playing])

  const listRanking = async () => {
    const { data } = await axios.get('/api/ranking')
    let highestScore = 0

    for (let i = 0; i < data.length; i++) {
      highestScore = Math.max(highestScore, data[i].score)
    }
    setHighscore(highestScore)
    setRanking(data)
  }

  const getRgb = () => Math.floor(Math.random() * 256)

  const rgbToHex = (r: number, g: number, b: number) =>
    '#' +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16)
        return hex.length === 1 ? '0' + hex : hex
      })
      .join('')

  const generateColor = () => {
    const color = {
      r: getRgb(),
      g: getRgb(),
      b: getRgb(),
    }

    return rgbToHex(color.r, color.g, color.b)
  }

  const nextQuestion = () => {
    setTimeSinceLastQuestion(0)
    const color = generateColor()
    if (refColor?.current) {
      refColor.current.style.background = color
    }

    const positionColorCorrect = Math.floor(
      Math.random() * level.quantityOptions,
    )
    setAnswers(
      Array.from({ length: level.quantityOptions }).map((_, index) =>
        positionColorCorrect === index ? color : generateColor(),
      ),
    )
    setColor(color)
  }

  const handleStart = () => {
    const isNameValid = regexValidate(player)
    if (!isNameValid) {
      setMessageNameError(
        'O nome do jogador não pode estar em branco e não pode conter caracteres especiais.',
      )
    } else {
      setUserAnswers([])
      setSecondsPassed(TIME)
      setPlaying(true)
      setScore(0)
      setStartTimer(new Date())
      nextQuestion()
    }
  }

  const handleRestart = () => {
    setSecondsPassed(TIME)
    setPlaying(true)
    setStartTimer(new Date())
    nextQuestion()
    setScore(0)
  }

  const handleVerifyAnswer = (answer: string) => {
    if (startTimer) {
      const secondsAnswered = differenceInSeconds(
        new Date(),
        new Date(startTimer),
      )

      const answerObject: UserAnswersProps = {
        correctAnswer: color,
        selectedAnswer: answer,
        timeAnswered: secondsAnswered,
      }

      setUserAnswers((userAnswer) => [answerObject, ...userAnswer])

      if (answer === color) {
        setScore((prevScore) => prevScore + 5)
        setStartTimer(dayjs(startTimer).add(2, 'seconds').toDate())
      } else {
        setScore((prevScore) => prevScore - 1)
        setStartTimer(dayjs(startTimer).subtract(2, 'seconds').toDate())
      }
    }
  }

  const timerPercentage = ((secondsPassed - 1) / (TIME - 1)) * 100

  const timerStyle = `${timerPercentage}%`

  useEffect(() => {
    if (playing && secondsPassed / 10 === 0) {
      setScore((prevScore) => prevScore - 2)
    }
  }, [playing, score, secondsPassed])

  const handleSubmitPlayer = async () => {
    await axios.post('/api/save', {
      name: player,
      score,
    })
  }

  return (
    <div className="flex flex-row">
      <SideBar userAnswers={userAnswers} setUserAnswers={setUserAnswers} />
      <div className="w-full flex items-center flex-col justify-center">
        <h1 className="text-5xl p-8">Guess the Color</h1>
        <div className="flex justify-center items-center flex-col">
          <h2 className="mb-4 font-semibold text-lg">Select the level: </h2>
          <div className="w-full flex justify-center rounded-sm mb-5">
            {typeLevel.map((type) => (
              <button
                key={type.nivel}
                type="button"
                className={`${
                  type.nivel === level.nivel ? 'bg-indigo-500' : 'bg-indigo-300'
                } px-6 py-2 rounded-xl ml-2 text-white text-lg ${
                  playing && 'cursor-not-allowed'
                }`}
                data-testid={type.nivel}
                disabled={playing}
                onClick={() =>
                  setLevel({
                    nivel: type.nivel,
                    quantityOptions: type.quantityOptions,
                  })
                }
              >
                {type.nivel}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-center mb-3 flex-col">
          <input
            name="player"
            data-testid="input-player"
            type="text"
            placeholder="Nome do Jogador"
            onChange={(e) => setPlayer(e.target.value)}
            disabled={playing}
            className="flex items-start border border-slate-500 rounded-md p-2"
          />
          {messageNameError && !playing && (
            <div data-testid="error-name" className="text-red-500 mt-2">
              {messageNameError}
            </div>
          )}
        </div>
        <div className="w-2/4 h-24 grid grid-cols-3 items-center bg-slate-300 rounded-md border border-black">
          <div className=" flex items-center flex-col">
            <span className="font-semibold">Tempo Restante (s)</span>
            <span>{secondsPassed}</span>
          </div>
          <div className="flex items-center justify-center w-full h-full border-2 border-black rounded-sm hover:bg-slate-400">
            <button
              type="button"
              disabled={!playing}
              className={`flex items-center justify-center h-full w-full cursor-pointer font-semibold ${
                !playing && 'cursor-not-allowed'
              }`}
              onClick={() => handleRestart()}
            >
              Restart
            </button>
          </div>
          <div className="flex flex-col items-center justify-center h-full ">
            <div className="flex flex-row items-center justify-between w-full h-full px-8">
              <span className="font-semibold">HighScore</span>
              <span>{highscore}</span>
            </div>
            <div className="flex flex-row items-center justify-between w-full h-full px-8 border-t-2 border-black">
              <span className="font-semibold">Score</span>
              <span>{score}</span>
            </div>
          </div>
        </div>
        <div className="w-2/4 h-2 bg-slate-200 mt-10 flex justify-start">
          <div
            className="max-w-full h-2 rounded-md bg-slate-400 transition-all ease-linear duration-1000"
            style={{ width: timerStyle }}
          />
        </div>
        {!playing && (
          <button
            type="button"
            data-testid="button-start"
            className="flex justify-center items-center bg-slate-300 mt-2 rounded-md w-2/4 h-72 text-3xl font-semibold"
            onClick={() => handleStart()}
          >
            Start
          </button>
        )}
        <div
          className={`mt-2 w-2/4 h-72 rounded-md ${!playing && 'hidden'}`}
          ref={refColor}
        />
        {playing && secondsPassed !== 0 && (
          <div className="w-2/4 h-24 mt-10 flex items-center rounded-md border-black">
            {answers.map((answer, index) => (
              <button
                key={answer}
                data-testid={`button-answer-${index}`}
                type="button"
                className="flex flex-1 items-center justify-center flex-col h-full bg-slate-300 cursor-pointer m-2 rounded-lg hover:bg-slate-400"
                onClick={() => handleVerifyAnswer(answer)}
              >
                {answer}
              </button>
            ))}
          </div>
        )}
      </div>
      <Ranking ranking={ranking} />
    </div>
  )
}
