import { arbitrumSepolia } from 'viem/chains'
import { State, VaultData } from './types'

export const initialState: State = { v: 0 }

export const vaultData: VaultData = {
  chain: arbitrumSepolia,
  address: '0xb81b725b16e99c840Ac17B396590da9c93c5bc3B',
  symbol: 'pUSDC',
  token: {
    address: '0x7A6DBc7fF4f1a2D864291DB3AeC105A8EeE4A3D2',
    decimals: 6,
    symbol: 'USDC'
  }
}

export const baseClassName =
  'w-full h-full flex flex-col items-center justify-center bg-purple-800 text-white'
