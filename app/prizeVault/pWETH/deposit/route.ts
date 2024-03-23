import { TransactionTargetResponse } from 'frames.js'
import { NextRequest, NextResponse } from 'next/server'
import { deposit } from '../../txs'
import { vaultData } from '../config'

export async function POST(req: NextRequest): Promise<NextResponse<TransactionTargetResponse>> {
  return NextResponse.json(deposit(vaultData, req))
}
