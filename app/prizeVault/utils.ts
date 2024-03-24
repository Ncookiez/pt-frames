import type { NextServerPageProps, PreviousFrame } from 'frames.js/next/types'
import { FrameData, FrameState, UserState, VaultData } from './types'
import { Address, Chain, HttpTransport, PublicClient } from 'viem'
import { initialState } from './constants'
import { getPreviousFrame } from 'frames.js/next/server'
import { erc20ABI, vaultABI } from '@generationsoftware/hyperstructure-client-js'
import { buttons } from '../contants'
import { useAsyncFramesReducer } from './state'

export const reducer = (
  state: UserState,
  action: PreviousFrame<FrameState>,
  vaultData: VaultData
): UserState => {
  const data = action.postBody?.untrustedData

  if (!!data) {
    state = buttons[state.view][data.buttonIndex - 1].onClick(state, vaultData, data.inputText)
  }

  return state
}

export const getFrameData = async (
  vaultData: VaultData,
  searchParams: NextServerPageProps['searchParams']
): Promise<FrameData> => {
  const previousFrame = getPreviousFrame<FrameState>(searchParams)

  const { frameState, userState, prevUserState } = await useAsyncFramesReducer(
    reducer,
    initialState,
    previousFrame,
    vaultData
  )

  return {
    pathname: `/prizeVault/${vaultData.id}`,
    postUrl: '/post',
    state: frameState,
    userState,
    prevUserState,
    previousFrame
  }
}

export const getBalances = async (
  vaultData: VaultData,
  client: PublicClient<HttpTransport, Chain>,
  userAddress: Address
) => {
  const balances = await client.multicall({
    contracts: [
      {
        address: vaultData.address,
        abi: vaultABI,
        functionName: 'balanceOf',
        args: [userAddress]
      },
      {
        address: vaultData.asset.address,
        abi: erc20ABI,
        functionName: 'balanceOf',
        args: [userAddress]
      },
      {
        address: vaultData.asset.address,
        abi: erc20ABI,
        functionName: 'allowance',
        args: [userAddress, vaultData.address]
      }
    ]
  })

  return {
    shares: balances[0].result as bigint,
    assets: balances[1].result as bigint,
    allowance: balances[2].result as bigint
  }
}
