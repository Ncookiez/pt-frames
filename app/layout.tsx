import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PoolTogether Frames',
  description: 'Farcaster frames for the PoolTogether protocol.'
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  )
}
