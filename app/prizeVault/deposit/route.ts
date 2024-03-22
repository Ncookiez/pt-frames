import { vaultABI } from '@generationsoftware/hyperstructure-client-js'
import { TransactionTargetResponse } from 'frames.js'
import { NextRequest, NextResponse } from 'next/server'
import { encodeFunctionData, isAddress, parseUnits } from 'viem'
import { vaultData } from '../constants'

export async function POST(req: NextRequest): Promise<NextResponse<TransactionTargetResponse>> {
  const _userAddress = req.nextUrl.searchParams.get('a')
  const _depositAmount = req.nextUrl.searchParams.get('da')

  if (!_userAddress) {
    throw new Error('No user address set')
  }

  if (!_depositAmount) {
    throw new Error('No deposit amount set')
  }

  const userAddress = isAddress(_userAddress) ? _userAddress : undefined

  if (!userAddress) {
    throw new Error('Invalid user address')
  }

  const depositAmount = parseUnits(_depositAmount, vaultData.token.decimals)

  const calldata = encodeFunctionData({
    abi: vaultABI,
    functionName: 'deposit',
    args: [depositAmount, userAddress]
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
