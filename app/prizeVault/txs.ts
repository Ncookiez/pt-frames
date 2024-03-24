import type { TransactionTargetResponse } from 'frames.js'
import type { NextRequest } from 'next/server'
import { encodeFunctionData, isAddress } from 'viem'
import type { VaultData } from './types'
import { erc20ABI, vaultABI } from '@generationsoftware/hyperstructure-client-js'
import { zeroValue } from '../contants'

export const approve = (vaultData: VaultData, req: NextRequest): TransactionTargetResponse => {
  const approvalAmount = BigInt(req.nextUrl.searchParams.get('aa') ?? '0')

  if (!approvalAmount) {
    throw new Error('No approval amount set')
  }

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
      to: vaultData.asset.address,
      data: calldata,
      value: zeroValue
    }
  }
}

export const deposit = (vaultData: VaultData, req: NextRequest): TransactionTargetResponse => {
  const _userAddress = req.nextUrl.searchParams.get('a')
  const depositAmount = BigInt(req.nextUrl.searchParams.get('da') ?? '0')

  if (!_userAddress) {
    throw new Error('No user address set')
  }

  if (!depositAmount) {
    throw new Error('No deposit amount set')
  }

  const userAddress = isAddress(_userAddress) ? _userAddress : undefined

  if (!userAddress) {
    throw new Error('Invalid user address')
  }

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
      value: zeroValue
    }
  }
}

export const redeem = (vaultData: VaultData, req: NextRequest): TransactionTargetResponse => {
  const _userAddress = req.nextUrl.searchParams.get('a')
  const redeemAmount = BigInt(req.nextUrl.searchParams.get('ra') ?? '0')

  if (!_userAddress) {
    throw new Error('No user address set')
  }

  if (!redeemAmount) {
    throw new Error('No redeem amount set')
  }

  const userAddress = isAddress(_userAddress) ? _userAddress : undefined

  if (!userAddress) {
    throw new Error('Invalid user address')
  }

  const calldata = encodeFunctionData({
    abi: vaultABI,
    functionName: 'redeem',
    args: [redeemAmount, userAddress, userAddress]
  })

  return {
    chainId: `eip155:${vaultData.chain.id}`,
    method: 'eth_sendTransaction',
    params: {
      abi: vaultABI,
      to: vaultData.address,
      data: calldata,
      value: zeroValue
    }
  }
}
