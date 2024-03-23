import { TransactionTargetResponse } from 'frames.js'
import { NextRequest, NextResponse } from 'next/server'
import { withdraw } from '../../txs'
import { vaultData } from '../config'

export async function POST(req: NextRequest): Promise<NextResponse<TransactionTargetResponse>> {
  return NextResponse.json(withdraw(vaultData, req))
}
