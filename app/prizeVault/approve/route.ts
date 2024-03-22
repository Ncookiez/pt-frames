import { erc20ABI } from '@generationsoftware/hyperstructure-client-js'
import { TransactionTargetResponse } from 'frames.js'
import { NextRequest, NextResponse } from 'next/server'
import { encodeFunctionData, parseUnits } from 'viem'
import { vaultData } from '../constants'

export async function POST(req: NextRequest): Promise<NextResponse<TransactionTargetResponse>> {
  const _approvalAmount = req.nextUrl.searchParams.get('aa')

  if (!_approvalAmount) {
    throw new Error('No approval amount set')
  }

  const approvalAmount = parseUnits(_approvalAmount, vaultData.token.decimals)

  const calldata = encodeFunctionData({
    abi: erc20ABI,
    functionName: 'approve',
    args: [vaultData.address, approvalAmount]
  })

  return NextResponse.json({
    chainId: `eip155:${vaultData.chain.id}`,
    method: 'eth_sendTransaction',
    params: {
      abi: erc20ABI,
      to: vaultData.token.address,
      data: calldata,
      value: '0'
    }
  })
}
