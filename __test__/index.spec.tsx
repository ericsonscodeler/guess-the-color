import React from 'react'
import { render, screen, act, waitFor, fireEvent } from '@testing-library/react'
import Home from '../src/app/page'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { RankingProps } from '@/app/types'
import { SideBar } from '../src/components/SideBar'
import { Ranking } from '@/components/Ranking'

const ranking: RankingProps[] = Array.from({ length: 5 }, (_, index) => ({
  name: `ranking-${index + 1}`,
  score: index + 1,
}))

const mock = new MockAdapter(axios)

describe('Testes', () => {
  beforeEach(() => {
    mock.onGet('/api/ranking').reply(200, ranking)
  })

  afterAll(() => {
    mock.reset()
  })
  it('Renderiza a página corretamente', async () => {
    await act(async () => {
      render(<Home />)
    })

    const title = screen.getByText('Guess the Color')
    expect(title)
  })
  it('Deve mostrar mensagem em que não foi preenchido o nome do jogador', async () => {
    await act(async () => {
      render(<Home />)
    })

    const levelElement = screen.getByTestId('Fácil')
    expect(levelElement)

    await waitFor(() => {
      fireEvent.click(screen.getByTestId('button-start'))
    })

    await waitFor(() => {
      expect(screen.getByTestId('error-name'))
    })
  })
  it('Ao carregar a página o nível deve começar no fácil', async () => {
    await act(async () => {
      render(<Home />)
    })

    const levelElement = screen.getByTestId('Fácil')
    expect(levelElement)

    await waitFor(() => {
      const inputField = screen.getByTestId('input-player')
      fireEvent.change(inputField, { target: { value: 'jogador' } })
    })

    await waitFor(() => {
      fireEvent.click(screen.getByTestId('button-start'))
    })

    await waitFor(() => {
      expect(screen.getByTestId('button-answer-0'))
      expect(screen.getByTestId('button-answer-1'))
      expect(screen.getByTestId('button-answer-2'))
    })
  })

  it('Ao carregar a página o nível deve começar no médio', async () => {
    await act(async () => {
      render(<Home />)
    })

    const levelElement = screen.getByTestId('Médio')
    fireEvent.click(levelElement)

    await waitFor(() => {
      const inputField = screen.getByTestId('input-player')
      fireEvent.change(inputField, { target: { value: 'jogador' } })
    })

    await waitFor(() => {
      fireEvent.click(screen.getByTestId('button-start'))
    })

    await waitFor(() => {
      expect(screen.getByTestId('button-answer-0'))
      expect(screen.getByTestId('button-answer-1'))
      expect(screen.getByTestId('button-answer-2'))
      expect(screen.getByTestId('button-answer-3'))
    })
  })

  it('Ao carregar a página o nível deve começar no difícil', async () => {
    await act(async () => {
      render(<Home />)
    })

    const levelElement = screen.getByTestId('Difício')
    fireEvent.click(levelElement)

    await waitFor(() => {
      const inputField = screen.getByTestId('input-player')
      fireEvent.change(inputField, { target: { value: 'jogador' } })
    })

    await waitFor(() => {
      fireEvent.click(screen.getByTestId('button-start'))
    })

    await waitFor(() => {
      expect(screen.getByTestId('button-answer-0'))
      expect(screen.getByTestId('button-answer-1'))
      expect(screen.getByTestId('button-answer-2'))
      expect(screen.getByTestId('button-answer-3'))
      expect(screen.getByTestId('button-answer-4'))
    })
  })

  it('Deve mostrar o ranking', async () => {
    await act(async () => {
      render(<Ranking ranking={ranking} />)
    })

    await waitFor(() => {
      expect(screen.findByTestId('ranking-1'))
      expect(screen.findByTestId('ranking-2'))
      expect(screen.findByTestId('ranking-3'))
      expect(screen.findByTestId('ranking-4'))
      expect(screen.findByTestId('ranking-5'))
    })
  })

  it('Verificar resposta correta', () => {
    const mockSetUserAnswers = jest.fn()
    const userAnswers = [
      {
        correctAnswer: 'A',
        selectedAnswer: 'A',
        timeAnswered: 5,
      },
    ]

    const { getAllByTestId } = render(
      <SideBar userAnswers={userAnswers} setUserAnswers={mockSetUserAnswers} />,
    )

    userAnswers.forEach((answer) => {
      const correctAnswerElement = getAllByTestId('correct').find(
        (el) => el.textContent?.includes(answer.correctAnswer),
      )
      expect(correctAnswerElement)
    })
  })

  it('Verificar resposta errada', () => {
    const mockSetUserAnswers = jest.fn()
    const userAnswers = [
      {
        correctAnswer: 'A',
        selectedAnswer: 'B',
        timeAnswered: 8,
      },
    ]

    const { getAllByTestId } = render(
      <SideBar userAnswers={userAnswers} setUserAnswers={mockSetUserAnswers} />,
    )

    userAnswers.forEach((answer) => {
      const wrongAnswerElement = getAllByTestId('wrong').find(
        (el) => el.textContent?.includes(answer.correctAnswer),
      )
      expect(wrongAnswerElement)
    })
  })
})
