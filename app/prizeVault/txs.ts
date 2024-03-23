import type { TransactionTargetResponse } from 'frames.js'
import type { NextRequest } from 'next/server'
import { encodeFunctionData, isAddress, parseUnits } from 'viem'
import type { VaultData } from './types'
import { erc20ABI, vaultABI } from '@generationsoftware/hyperstructure-client-js'

export const approve = (vaultData: VaultData, req: NextRequest): TransactionTargetResponse => {
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

  return {
    chainId: `eip155:${vaultData.chain.id}`,
    method: 'eth_sendTransaction',
    params: {
      abi: erc20ABI,
      to: vaultData.token.address,
      data: calldata,
      value: '0'
    }
  }
}

export const deposit = (vaultData: VaultData, req: NextRequest): TransactionTargetResponse => {
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

  return {
    chainId: `eip155:${vaultData.chain.id}`,
    method: 'eth_sendTransaction',
    params: {
      abi: vaultABI,
      to: vaultData.address,
      data: calldata,
      value: '0'
    }
  }
}

export const withdraw = (vaultData: VaultData, req: NextRequest): TransactionTargetResponse => {
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

  return {
    chainId: `eip155:${vaultData.chain.id}`,
    method: 'eth_sendTransaction',
    params: {
      abi: vaultABI,
      to: vaultData.address,
      data: calldata,
      value: '0'
    }
  }
}
