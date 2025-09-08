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
      <nav className="bg-white shadow-sm border-b border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-[#57C84D]">
              Fliq
            </Link>
            <WalletConnectButton />
          </div>
        </div>
      </nav>
    )
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:block bg-white shadow-sm border-b border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-2xl font-bold text-[#57C84D]">
                Fliq
              </Link>
              <div className="flex space-x-6">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      pathname === item.href
                        ? 'bg-[#57C84D] text-white'
                        : 'text-[#555555] hover:text-[#0F0F0F] hover:bg-[#F5F5F5]'
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
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E5E5] z-50">
        <div className="grid grid-cols-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-3 px-4 text-xs transition-colors ${
                pathname === item.href
                  ? 'text-[#57C84D] bg-[#F5F5F5]'
                  : 'text-[#555555]'
              }`}
            >
              <span className="text-lg mb-1">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Top Bar */}
      <div className="md:hidden bg-white shadow-sm border-b border-[#E5E5E5]">
        <div className="flex justify-between items-center px-4 h-16">
          <Link href="/" className="text-xl font-bold text-[#57C84D]">
            Fliq
          </Link>
          <WalletConnectButton />
        </div>
      </div>
    </>
  )
}
