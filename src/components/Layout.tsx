import Footer from './Footer'
import type React from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#app-main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-gray-900 focus:shadow dark:focus:bg-gray-800 dark:focus:text-gray-50"
      >
        Skip to main content
      </a>
      <main id="app-main" className="flex h-screen w-full flex-col items-center pb-4">
        {children}
        <Footer />
      </main>
    </>
  )
}
