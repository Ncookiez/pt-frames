import { optimism } from 'viem/chains'
import { VaultData } from '../types'

export const vaultData: VaultData = {
  id: 'pWETH',
  chain: optimism,
  address: '0xf0b19f02c63d51b69563a2b675e0160e1c34397c',
  symbol: 'pWETH',
  token: {
    address: '0x4200000000000000000000000000000000000006',
    decimals: 18,
    symbol: 'WETH'
  }
}
