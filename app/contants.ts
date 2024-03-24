import { optimism } from 'viem/chains'
import { View, ViewButton } from './prizeVault/types'
import { isAddress, parseUnits } from 'viem'

export const rpcUrls: { [chainId: number]: string | undefined } = {
  [optimism.id]: process.env.NEXT_PUBLIC_OPTIMISM_RPC_URL
}

export const buttons: Record<View, ViewButton[]> = {
  [View.welcome]: [
    {
      name: 'deposit',
      onClick: (state) => {
        if (!!state.userAddress) {
          return { ...state, view: View.depositParams }
        } else {
          return { ...state, view: View.address }
        }
      }
    },
    {
      name: 'viewAccount',
      onClick: (state) => {
        if (!!state.userAddress) {
          return { ...state, view: View.account }
        } else {
          return { ...state, view: View.address }
        }
      }
    }
  ],
  [View.address]: [
    {
      name: 'submit',
      onClick: (state, vaultData, inputText) => {
        if (!!inputText && isAddress(inputText)) {
          return { ...state, view: View.account, userAddress: inputText }
        } else {
          return state
        }
      }
    }
  ],
  [View.account]: [
    {
      name: 'deposit',
      onClick: (state) => {
        return { ...state, view: View.depositParams }
      }
    },
    {
      name: 'withdraw',
      onClick: (state) => {
        return { ...state, view: View.redeemParams }
      }
    },
    {
      name: 'switchAccount',
      onClick: (state) => {
        return { ...state, view: View.address }
      }
    }
  ],
  [View.depositParams]: [
    {
      name: 'back',
      onClick: (state) => {
        return { ...state, view: View.account }
      }
    },
    {
      name: 'depositAmount',
      onClick: (state, vaultData, inputText) => {
        if (!!inputText && !!state.balance) {
          const depositAmount = parseUnits(inputText, vaultData.asset.decimals)
          const assetBalance = BigInt(state.balance.assets)
          const allowance = BigInt(state.allowance ?? '0')

          if (depositAmount > 0n && depositAmount <= assetBalance) {
            if (allowance >= depositAmount) {
              return {
                ...state,
                view: View.depositTx,
                depositAssetAmount: depositAmount.toString()
              }
            } else {
              return {
                ...state,
                view: View.approveTx,
                depositAssetAmount: depositAmount.toString()
              }
            }
          }
        }

        return state
      }
    }
  ],
  [View.approveTx]: [
    {
      name: 'cancel',
      onClick: (state) => {
        return { ...state, view: View.account }
      }
    },
    {
      name: 'approve',
      onClick: (state) => {
        return { ...state, view: View.depositTx }
      }
    }
  ],
  [View.depositTx]: [
    {
      name: 'cancel',
      onClick: (state) => {
        return { ...state, view: View.account }
      }
    },
    {
      name: 'deposit',
      onClick: (state) => {
        return { ...state, view: View.depositTxSuccess }
      }
    }
  ],
  [View.depositTxSuccess]: [
    {
      name: 'viewAccount',
      onClick: (state) => {
        return { ...state, view: View.account }
      }
    }
  ],
  [View.redeemParams]: [
    {
      name: 'back',
      onClick: (state) => {
        return { ...state, view: View.account }
      }
    },
    {
      name: 'withdrawAmount',
      onClick: (state, vaultData, inputText) => {
        if (!!inputText && !!state.balance) {
          const redeemAmount = parseUnits(inputText, vaultData.asset.decimals)
          const shareBalance = BigInt(state.balance.shares)

          if (redeemAmount > 0n && redeemAmount <= shareBalance) {
            return { ...state, view: View.redeemTx, redeemShareAmount: redeemAmount.toString() }
          }
        }

        return state
      }
    },
    {
      name: 'withdrawAll',
      onClick: (state) => {
        if (!!state.balance) {
          return { ...state, view: View.redeemTx, redeemShareAmount: state.balance.shares }
        }

        return state
      }
    }
  ],
  [View.redeemTx]: [
    {
      name: 'cancel',
      onClick: (state) => {
        return { ...state, view: View.account }
      }
    },
    {
      name: 'withdraw',
      onClick: (state) => {
        return { ...state, view: View.redeemTxSuccess }
      }
    }
  ],
  [View.redeemTxSuccess]: [
    {
      name: 'viewAccount',
      onClick: (state) => {
        return { ...state, view: View.account }
      }
    }
  ]
}

export const zeroValue = '0x0000000000000000000000000000000000000000000000000000000000000000'
