import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import { CartProvider } from '@/components/cart/cart-provider'
import { LanguageProvider } from '@/components/i18n/language-provider'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { getServerLocale } from '@/lib/i18n-server'
import './globals.css'

export const metadata: Metadata = {
  title: 'Catalog - Quality Products for Every Need',
  description: 'Discover our curated collection of quality products. Browse categories, view specifications, and shop with ease.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getServerLocale()

  return (
    <html lang={locale}>
      <body className="font-sans antialiased">
        <LanguageProvider initialLocale={locale}>
          <CartProvider>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster position="bottom-right" />
          </CartProvider>
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  )
}
