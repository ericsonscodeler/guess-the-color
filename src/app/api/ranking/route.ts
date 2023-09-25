import { prisma } from '../../../lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const players = await prisma.player.findMany()

  return NextResponse.json(players, { status: 200 })
}
