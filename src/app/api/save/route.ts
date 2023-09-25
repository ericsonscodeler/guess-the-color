import { prisma } from '../../../lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

interface PlayerProps {
  name: string
  score: number
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const player: PlayerProps = body

  // const playerExist = await prisma.player.findFirstOrThrow({
  //   where: {
  //     name: player.name,
  //   },
  // })

  // if (playerExist) {
  //   return new NextResponse('Player already exists', {
  //     status: 400,
  //   })
  // }
  await prisma.player.create({
    data: player,
  })

  return NextResponse.json(player, { status: 200 })
}
