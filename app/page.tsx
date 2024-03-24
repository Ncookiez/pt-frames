import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <main className='mt-8 flex h-full w-full flex-col items-center justify-center gap-8'>
      <Image
        src='/pt-logo.svg'
        alt='PoolTogether'
        width={716}
        height={284}
        priority={true}
        className='h-20'
      />
      <h1 className='text-2xl font-bold'>Frames Available:</h1>
      <ul>
        <li>
          <Link href='/prizeVault/pUSDC'>/prizeVault/pUSDC</Link>
        </li>
        <li>
          <Link href='/prizeVault/pWETH'>/prizeVault/pWETH</Link>
        </li>
        <li>
          <Link href='/prizeVault/test-usdc'>/prizeVault/test-usdc</Link>
        </li>
      </ul>
    </main>
  )
}
