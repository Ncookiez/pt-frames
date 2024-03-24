import type { NextServerPageProps, FrameReducer } from 'frames.js/next/types'
import { FrameData, State, VaultData, View } from './types'
import { Address, Chain, HttpTransport, PublicClient, formatUnits, isAddress } from 'viem'
import { initialState } from './constants'
import type { ActionIndex } from 'frames.js'
import { getFrameMessage, getPreviousFrame, useFramesReducer } from 'frames.js/next/server'
import { erc20ABI, vaultABI } from '@generationsoftware/hyperstructure-client-js'

export const reducer: FrameReducer<State> = (state, action): State => {
  const data = action.postBody?.untrustedData

  const isSignedIn = !!state.a

  const userAddress =
    !isSignedIn &&
    (state.v === View.account || state.v === View.depositParams) &&
    data?.buttonIndex === 1 &&
    !!data.inputText &&
    isAddress(data.inputText.trim())
      ? (data.inputText.trim() as Address)
      : state.v === View.account && data?.buttonIndex === 3
        ? undefined
        : state.a

  const parsedDepositFormAmount =
    isSignedIn && state.v === View.depositParams && data?.buttonIndex === 2 && !!data?.inputText
      ? getRoundNumber(parseFloat(data.inputText.trim()))
      : undefined
  const depositTokenAmount =
    !!parsedDepositFormAmount &&
    parsedDepositFormAmount > 0 &&
    !!state.tb &&
    parsedDepositFormAmount <= state.tb
      ? parsedDepositFormAmount
      : state.da

  const parsedWithdrawFormAmount =
    state.v === View.withdrawParams && data?.buttonIndex === 2 && !!data?.inputText
      ? getRoundNumber(parseFloat(data.inputText.trim()))
      : state.v === View.withdrawParams && data?.buttonIndex === 3
        ? state.sb
        : undefined
  const withdrawShareAmount =
    !!parsedWithdrawFormAmount &&
    parsedWithdrawFormAmount > 0 &&
    !!state.sb &&
    parsedWithdrawFormAmount <= state.sb
      ? parsedWithdrawFormAmount
      : state.wa

  const view = getView(state.v, {
    buttonIndex: data?.buttonIndex,
    isSignedIn,
    userAddress,
    depositTokenAmount,
    withdrawShareAmount
  })

  if (view === View.welcome) {
    return initialState
  } else if (view === View.approveTx || view === View.depositTx) {
    return { ...state, v: view, a: userAddress, da: depositTokenAmount }
  } else if (view === View.withdrawTx) {
    return { ...state, v: view, a: userAddress, wa: withdrawShareAmount }
  } else {
    return { ...state, v: view, a: userAddress }
  }
}

export const getView = (
  currentView: View,
  data: {
    buttonIndex?: ActionIndex
    isSignedIn?: boolean
    userAddress?: Address
    depositTokenAmount?: number
    withdrawShareAmount?: number
  }
) => {
  let view = View.welcome

  if (currentView === View.welcome) {
    if (data.buttonIndex === 1) {
      view = View.depositParams
    } else if (data.buttonIndex === 2) {
      view = View.account
    }
  } else if (currentView === View.account) {
    if (data.buttonIndex === 1 && !!data.isSignedIn && !!data.userAddress) {
      view = View.depositParams
    } else if (data.buttonIndex === 2 && !!data.isSignedIn && !!data.userAddress) {
      view = View.withdrawParams
    } else {
      view = View.account
    }
  } else if (currentView === View.depositParams) {
    if (data.buttonIndex === 1 && !!data.isSignedIn) {
      view = View.account
    } else if (!!data.depositTokenAmount) {
      view = View.approveTx
    } else {
      view = View.depositParams
    }
  } else if (currentView === View.approveTx || currentView === View.depositTx) {
    if (data.buttonIndex === 2) {
      view = View.depositTx
    } else {
      view = View.account
    }
  } else if (currentView === View.withdrawParams) {
    if (data.buttonIndex === 1) {
      view = View.account
    } else if (!!data.withdrawShareAmount) {
      view = View.withdrawTx
    } else {
      view = View.withdrawParams
    }
  } else if (currentView === View.withdrawTx) {
    if (data.buttonIndex === 2) {
      view = View.withdrawTx
    } else {
      view = View.account
    }
  }

  return view
}

export const getFrameData = async (
  vaultData: VaultData,
  searchParams: NextServerPageProps['searchParams']
): Promise<FrameData> => {
  const previousFrame = getPreviousFrame<State>(searchParams)
  const [state] = useFramesReducer<State>(reducer, initialState, previousFrame)
  const frameMessage = await getFrameMessage(previousFrame.postBody)

  return {
    pathname: `/prizeVault/${vaultData.id}`,
    postUrl: '/post',
    state,
    previousFrame,
    message: frameMessage
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
        address: vaultData.token.address,
        abi: erc20ABI,
        functionName: 'balanceOf',
        args: [userAddress]
      }
    ]
  })

  const shareBalance = getRoundNumber(
    parseFloat(formatUnits(balances[0].result as bigint, vaultData.token.decimals))
  )
  const tokenBalance = getRoundNumber(
    parseFloat(formatUnits(balances[1].result as bigint, vaultData.token.decimals))
  )

  return { shareBalance, tokenBalance }
}

export const getRoundNumber = (num: number) => {
  return Math.floor(num * 1e4) / 1e4
}

interface Button {
  name: string
  onClick: (state: State, inputText?: string) => State
}

const views: Record<View, Button[]> = {
  [View.welcome]: [
    {
      name: 'deposit',
      onClick: (state) => {
        state.v = View.depositParams
        return state
      }
    }
  ],
  [View.account]: [],
  [View.depositParams]: [],
  [View.approveTx]: [],
  [View.depositTx]: [],
  [View.withdrawParams]: [],
  [View.withdrawTx]: []
}
