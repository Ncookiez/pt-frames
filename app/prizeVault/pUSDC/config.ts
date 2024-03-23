import { optimism } from 'viem/chains'
import { VaultData } from '../types'

export const vaultData: VaultData = {
  id: 'pUSDC',
  chain: optimism,
  address: '0x77935f2c72b5eb814753a05921ae495aa283906b',
  symbol: 'pUSDC',
  token: {
    address: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
    decimals: 6,
    symbol: 'USDC'
  }
}
