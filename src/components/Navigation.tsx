'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import WalletConnectButton from './WalletConnectButton'
import { Target, User, Trophy } from 'lucide-react'
import Image from 'next/image'

export default function Navigation() {
  const pathname = usePathname()

  const navItems = [
    { href: '/app/predictions', label: 'Predict', icon: Target },
    { href: '/app/user', label: 'Profile', icon: User },
    { href: '/app/leaderboard', label: 'Leaderboard', icon: Trophy },
  ]

  if (pathname === '/') {
    return (
      <nav className="absolute top-0 left-0 right-0 z-50 bg-transparent">
        <div className="max-w-7xl mx-auto px-6 py-6">
           <div className="flex justify-between items-center">
             <Link href="/" className="hover:scale-105 transition-transform">
               <Image 
                 src="/fliq-logo.png" 
                 alt="Fliq" 
                 width={80} 
                 height={40}
                 className="h-8 w-auto"
               />
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
               <Link href="/" className="hover:scale-105 transition-transform">
                 <Image 
                   src="/fliq-logo.png" 
                   alt="Fliq" 
                   width={80} 
                   height={40}
                   className="h-7 w-auto"
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
                        : 'text-brand-gray hover:text-brand-black hover:bg-brand-bgGray'
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
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-fliq-border z-50">
        <div className="grid grid-cols-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-3 px-4 text-xs transition-colors ${
                pathname === item.href
                  ? 'text-brand-green bg-brand-bgGray'
                  : 'text-brand-gray'
              }`}
            >
              <item.icon className={`w-5 h-5 mb-1 ${
                pathname === item.href ? 'text-brand-green' : 'text-brand-gray'
              }`} />
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Top Bar */}
      <div className="md:hidden bg-white shadow-sm border-b border-fliq-border">
         <div className="flex justify-between items-center px-4 h-16">
           <Link href="/" className="hover:scale-105 transition-transform">
             <Image 
               src="/fliq-logo.png" 
               alt="Fliq" 
               width={70} 
               height={35}
               className="h-6 w-auto"
             />
           </Link>
          <WalletConnectButton />
        </div>
      </div>
    </>
  )
}
