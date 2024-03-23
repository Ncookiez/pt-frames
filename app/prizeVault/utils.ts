import type { NextServerPageProps, FrameReducer } from 'frames.js/next/types'
import { FrameData, State, VaultData, View } from './types'
import { Address, isAddress } from 'viem'
import { initialState } from './constants'
import type { ActionIndex } from 'frames.js'
import { getFrameMessage, getPreviousFrame, useFramesReducer } from 'frames.js/next/server'

export const reducer: FrameReducer<State> = (state, action): State => {
  const data = action.postBody?.untrustedData

  const userAddress =
    state.v === View.account &&
    data?.buttonIndex === 1 &&
    !!data.inputText &&
    isAddress(data.inputText.trim())
      ? (data.inputText.trim() as Address)
      : state.a

  const parsedDepositFormAmount =
    state.v === View.depositParams && !!data?.inputText
      ? parseFloat(data.inputText.trim())
      : undefined
  const depositTokenAmount =
    !!parsedDepositFormAmount &&
    parsedDepositFormAmount > 0 &&
    !!state.tb &&
    parsedDepositFormAmount <= state.tb
      ? parsedDepositFormAmount
      : state.da

  const parsedWithdrawFormAmount =
    state.v === View.withdrawParams && !!data?.inputText
      ? parseFloat(data.inputText.trim())
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
    isSignedIn: !!state.a,
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
    if (data.buttonIndex === 1 || data.buttonIndex === 2) {
      view = View.account // TODO: this should go to depositparams view if user has cached fid and clicked button 1
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
    if (data.buttonIndex === 1) {
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
