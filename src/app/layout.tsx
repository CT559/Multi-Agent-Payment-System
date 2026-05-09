import type { Metadata } from 'next'
import { JetBrains_Mono, Rajdhani } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/layout/Providers'
import { Toaster } from 'sonner'

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-mono',
})

const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
})

export const metadata: Metadata = {
  title: 'NANOPAY // Multi-Agent Payment System',
  description: 'Autonomous AI agent micropayments on Arc Testnet',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jetbrains.variable} ${rajdhani.variable}`}>
      <body>
        <Providers>
          {children}
          <Toaster
            theme="dark"
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#060e15',
                border: '1px solid #00ffa325',
                color: '#00ffa3',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}
