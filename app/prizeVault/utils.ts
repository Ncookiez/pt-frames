import type { FrameReducer } from 'frames.js/next/types'
import { State, View } from './types'
import { Address, isAddress } from 'viem'
import { initialState } from './constants'
import type { ActionIndex } from 'frames.js'

export const reducer: FrameReducer<State> = (state, action): State => {
  const data = action.postBody?.untrustedData

  const userAddress =
    state.v === View.welcome &&
    data?.buttonIndex === 1 &&
    !!data?.inputText &&
    isAddress(data.inputText.trim())
      ? (data.inputText.trim() as Address)
      : state.a

  const parsedAccountFormAmount =
    state.v === View.account && !!data?.inputText ? parseFloat(data.inputText.trim()) : undefined

  const depositTokenAmount =
    data?.buttonIndex === 2 &&
    !!parsedAccountFormAmount &&
    parsedAccountFormAmount > 0 &&
    !!state.tb &&
    parsedAccountFormAmount <= state.tb
      ? parsedAccountFormAmount
      : state.da

  const withdrawShareAmount =
    data?.buttonIndex === 3 &&
    !!parsedAccountFormAmount &&
    parsedAccountFormAmount > 0 &&
    !!state.sb &&
    parsedAccountFormAmount <= state.sb
      ? parsedAccountFormAmount
      : state.wa

  const view = getView(state.v, {
    buttonIndex: data?.buttonIndex,
    userAddress,
    depositTokenAmount,
    withdrawShareAmount
  })

  if (view === View.account) {
    return { ...state, v: view, a: userAddress }
  } else if (view === View.deposit) {
    return { ...state, v: view, a: userAddress, da: depositTokenAmount }
  } else if (view === View.withdraw) {
    return { ...state, v: view, a: userAddress, wa: withdrawShareAmount }
  } else {
    return initialState
  }
}

export const getView = (
  currentView: View,
  data: {
    buttonIndex?: ActionIndex
    userAddress?: Address
    depositTokenAmount?: number
    withdrawShareAmount?: number
  }
) => {
  let view: View = 0

  if (currentView === View.welcome) {
    if (data.buttonIndex === 1 && !!data.userAddress) {
      view = View.account
    }
  } else if (currentView === View.account) {
    if (data?.buttonIndex === 1) {
      view = View.welcome
    } else if (data?.buttonIndex === 2 && !!data.depositTokenAmount) {
      view = View.deposit
    } else if (data?.buttonIndex === 3 && !!data.withdrawShareAmount) {
      view = View.withdraw
    } else {
      view = View.account
    }
  } else if (currentView === View.deposit) {
    if (data?.buttonIndex === 1) {
      view = View.account
    } else {
      view = View.deposit
    }
  } else if (currentView === View.withdraw) {
    if (data?.buttonIndex === 1) {
      view = View.account
    } else {
      view = View.withdraw
    }
  }

  return view
}
