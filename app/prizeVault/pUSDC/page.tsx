import { NextServerPageProps } from 'frames.js/next/server'
import { vaultData } from './config'
import { PrizeVaultFrame } from '../Frame'

export default async function Home({ searchParams }: NextServerPageProps) {
  return <PrizeVaultFrame vaultData={vaultData} searchParams={searchParams} />
}
