import type { FrameContainer } from 'frames.js/next/server'
import type { Address, Chain, HttpTransport, PublicClient } from 'viem'

export interface FrameProps {
  frameData: FrameData
  vaultData: VaultData
  client: PublicClient<HttpTransport, Chain>
}

export type FrameContrainerParams = Parameters<typeof FrameContainer<FrameState>>[0]

export interface FrameData extends Omit<FrameContrainerParams, 'children'> {
  userState: UserState
  prevUserState: UserState
}

export interface VaultData {
  id: string
  chain: Chain
  address: Address
  symbol: string
  asset: {
    address: Address
    decimals: number
    symbol: string
  }
}

export enum View {
  welcome = 0,
  address = 1,
  account = 2,
  depositParams = 3,
  approveTx = 4,
  depositTx = 5,
  depositTxSuccess = 6,
  redeemParams = 7,
  redeemTx = 8,
  redeemTxSuccess = 9
}

export interface ViewButton {
  name: string
  onClick: (state: UserState, vaultData: VaultData, inputText?: string) => UserState
}

export type FrameState = {
  fid?: number // farcaster ID
  t?: number // timestamp
}

export type UserState = {
  view: View
  userAddress?: Address
  balance?: { shares: string; assets: string }
  allowance?: string
  depositAssetAmount?: string
  redeemShareAmount?: string
}
