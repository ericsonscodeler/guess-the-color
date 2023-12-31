'use client'

import React from 'react'
interface UserProps {
  name: string
  score: number
}

interface RankingProps {
  ranking: UserProps[]
}

export const Ranking: React.FC<RankingProps> = ({ ranking }) => {
  return (
    <div className="h-screen w-96 bg-slate-300 p-3 flex flex-col">
      <div className="flex items-center justify-center mt-3 mb-3 font-bold">
        <h1>Ranking</h1>
      </div>
      <div className="flex flex-row items-center justify-between p-6 font-bold">
        <span>Name</span>
        <span>Score</span>
      </div>
      <div className="overflow-y-auto h-4/5 py-4">
        {ranking.map((player: UserProps, index: number) => (
          <div
            data-test-id={player.name}
            key={index}
            className="flex items-center justify-between px-6 font-semibold"
          >
            <span>{player.name}</span>
            <span>{player.score}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
