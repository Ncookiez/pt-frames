import { arbitrumSepolia } from 'viem/chains'
import { VaultData } from '../types'

export const vaultData: VaultData = {
  id: 'test-usdc',
  chain: arbitrumSepolia,
  address: '0xb81b725b16e99c840Ac17B396590da9c93c5bc3B',
  symbol: 'pUSDC',
  asset: {
    address: '0x7A6DBc7fF4f1a2D864291DB3AeC105A8EeE4A3D2',
    decimals: 6,
    symbol: 'USDC'
  }
}
