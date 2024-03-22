import { vaultABI } from '@generationsoftware/hyperstructure-client-js'
import { TransactionTargetResponse } from 'frames.js'
import { NextRequest, NextResponse } from 'next/server'
import { encodeFunctionData, isAddress, parseUnits } from 'viem'
import { vaultData } from '../constants'

export async function POST(req: NextRequest): Promise<NextResponse<TransactionTargetResponse>> {
  const _userAddress = req.nextUrl.searchParams.get('a')
  const _withdrawAmount = req.nextUrl.searchParams.get('wa')

  if (!_userAddress) {
    throw new Error('No user address set')
  }

  if (!_withdrawAmount) {
    throw new Error('No withdraw amount set')
  }

  const userAddress = isAddress(_userAddress) ? _userAddress : undefined

  if (!userAddress) {
    throw new Error('Invalid user address')
  }

  const withdrawAmount = parseUnits(_withdrawAmount, vaultData.token.decimals)

  const calldata = encodeFunctionData({
    abi: vaultABI,
    functionName: 'redeem',
    args: [withdrawAmount, userAddress, userAddress]
  })

  return NextResponse.json({
    chainId: `eip155:${vaultData.chain.id}`,
    method: 'eth_sendTransaction',
    params: {
      abi: vaultABI,
      to: vaultData.address,
      data: calldata,
      value: '0'
    }
  })
}
