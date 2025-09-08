'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import WalletConnectButton from './WalletConnectButton'

export default function Navigation() {
  const pathname = usePathname()

  const navItems = [
    { href: '/app/predictions', label: 'Predict', icon: '🎯' },
    { href: '/app/user', label: 'Profile', icon: '👤' },
    { href: '/app/leaderboard', label: 'Leaderboard', icon: '🏆' },
  ]

  if (pathname === '/') {
    return (
      <nav className="absolute top-0 left-0 right-0 z-50 bg-transparent">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-black bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent hover:scale-105 transition-transform">
              Fliq
            </Link>
            {/* Clean landing page - no wallet connection */}
          </div>
        </div>
      </nav>
    )
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:block bg-white shadow-sm border-b border-fliq-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-2xl font-bold text-fliq-green">
                Fliq
              </Link>
              <div className="flex space-x-6">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      pathname === item.href
                        ? 'bg-fliq-green text-white'
                        : 'text-fliq-gray hover:text-fliq-dark hover:bg-fliq-bg-gray'
                    }`}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <WalletConnectButton />
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-fliq-border z-50">
        <div className="grid grid-cols-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-3 px-4 text-xs transition-colors ${
                pathname === item.href
                  ? 'text-fliq-green bg-fliq-bg-gray'
                  : 'text-fliq-gray'
              }`}
            >
              <span className="text-lg mb-1">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Top Bar */}
      <div className="md:hidden bg-white shadow-sm border-b border-fliq-border">
        <div className="flex justify-between items-center px-4 h-16">
          <Link href="/" className="text-xl font-bold text-fliq-green">
            Fliq
          </Link>
          <WalletConnectButton />
        </div>
      </div>
    </>
  )
}
