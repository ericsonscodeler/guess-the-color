import { prisma } from '../../../lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

interface PlayerProps {
  name: string
  score: number
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const player: PlayerProps = body

  await prisma.player.create({
    data: player,
  })

  return NextResponse.json(player, { status: 200 })
}
