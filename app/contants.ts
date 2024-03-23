import { optimism } from 'viem/chains'

export const rpcUrls: { [chainId: number]: string | undefined } = {
  [optimism.id]: process.env.NEXT_PUBLIC_OPTIMISM_RPC_URL
}
