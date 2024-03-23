import type { FrameActionDataParsedAndHubContext } from 'frames.js'
import type { FrameContainer } from 'frames.js/next/server'
import type { Address, Chain, HttpTransport, PublicClient } from 'viem'

export interface FrameProps {
  frameData: FrameData
  vaultData: VaultData
  client: PublicClient<HttpTransport, Chain>
}

export interface FrameData extends Omit<Parameters<typeof FrameContainer<State>>[0], 'children'> {
  message: FrameActionDataParsedAndHubContext | null
}

export interface VaultData {
  id: string
  chain: Chain
  address: Address
  symbol: string
  token: {
    address: Address
    decimals: number
    symbol: string
  }
}

export enum View {
  welcome = 0,
  account = 1,
  depositParams = 2,
  approveTx = 3,
  depositTx = 4,
  withdrawParams = 5,
  withdrawTx = 6
}

export type State = {
  v: View // view
  a?: Address // user address
  sb?: number // user share balance
  tb?: number // user token balance
  da?: number // deposit token amount
  wa?: number // withdraw share amount
}
