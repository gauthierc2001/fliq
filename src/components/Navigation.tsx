'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import WalletConnectButton from './WalletConnectButton'
import { Target, User, Trophy } from 'lucide-react'
import Image from 'next/image'

// X/Twitter Icon Component
const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)

export default function Navigation() {
  const pathname = usePathname()

  const navItems = [
    { href: '/app/predictions', label: 'Predict', icon: Target },
    { href: '/app/user', label: 'Profile', icon: User },
    { href: '/app/leaderboard', label: 'Leaderboard', icon: Trophy },
  ]

  if (pathname === '/') {
    return (
      <nav className="absolute top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
           <div className="flex justify-between items-center">
             <Link href="/" className="hover:scale-105 transition-transform">
              <Image 
                src="/logo.png" 
                alt="Fliq" 
                width={100} 
                height={50}
                className="h-9 w-auto"
              />
             </Link>
             {/* X/Twitter Button */}
             <a 
               href="https://x.com/justfliq" 
               target="_blank" 
               rel="noopener noreferrer"
               className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 hover:scale-110"
             >
               <XIcon className="w-5 h-5 text-white" />
             </a>
           </div>
        </div>
      </nav>
    )
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:block bg-black shadow-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
             <div className="flex items-center space-x-8">
               <Link href="/" className="hover:scale-105 transition-transform">
                <Image 
                  src="/logo.png" 
                  alt="Fliq" 
                  width={100} 
                  height={50}
                  className="h-9 w-auto"
                />
               </Link>
              <div className="flex space-x-6">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${
                      pathname === item.href
                        ? 'bg-brand-green text-white'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    <item.icon className={`w-4 h-4 mr-2 ${
                      pathname === item.href ? 'text-white' : 'text-brand-green'
                    }`} />
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
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 z-50">
        <div className="grid grid-cols-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-3 px-4 text-xs transition-colors ${
                pathname === item.href
                  ? 'text-brand-green bg-gray-800'
                  : 'text-gray-400'
              }`}
            >
              <item.icon className={`w-5 h-5 mb-1 ${
                pathname === item.href ? 'text-brand-green' : 'text-gray-400'
              }`} />
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Top Bar */}
      <div className="md:hidden bg-black shadow-sm border-b border-gray-800">
         <div className="flex justify-between items-center px-4 h-16">
           <Link href="/" className="hover:scale-105 transition-transform">
            <Image 
              src="/logo.png" 
              alt="Fliq" 
              width={80} 
              height={40}
              className="h-7 w-auto"
            />
           </Link>
          <WalletConnectButton />
        </div>
      </div>
    </>
  )
}
