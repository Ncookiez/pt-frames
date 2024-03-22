import type { FrameActionDataParsedAndHubContext } from 'frames.js'
import type { FrameContainer } from 'frames.js/next/server'
import type { Address, Chain, HttpTransport, PublicClient } from 'viem'

export interface FrameProps {
  frameData: FrameData
  client: PublicClient<HttpTransport, Chain>
}

export interface FrameData extends Omit<Parameters<typeof FrameContainer<State>>[0], 'children'> {
  message: FrameActionDataParsedAndHubContext | null
}

export interface VaultData {
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
  deposit = 2,
  withdraw = 3
}

export type State = {
  v: View // view
  a?: Address // user address
  sb?: number // user share balance
  tb?: number // user token balance
  da?: number // deposit token amount
  wa?: number // withdraw share amount
}
