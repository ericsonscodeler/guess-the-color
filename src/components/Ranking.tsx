'use client'

interface UserProps {
  name: string
  score: number
}

interface RankingProps {
  ranking: UserProps[]
}

export const Ranking: React.FC<RankingProps> = ({ ranking }) => {
  console.log(ranking)
  return (
    <div className="h-screen w-96 bg-slate-300 p-3 flex flex-col">
      <div className="flex items-center justify-center mt-3 mb-3">
        <h1>Ranking</h1>
      </div>
      <div className="flex flex-row items-center justify-between p-6">
        <span>Name</span>
        <span>Score</span>
      </div>
      <div className="overflow-y-auto h-4/5 py-4">
        {ranking.map((player: UserProps, index: number) => (
          <div key={index} className="flex items-center justify-between px-6">
            <span>{player.name}</span>
            <span>{player.score}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
