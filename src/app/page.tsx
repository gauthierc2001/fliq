'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function HomePage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-indigo-50 to-emerald-50">
        {/* Floating Orbs */}
        <motion.div 
          className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-violet-400 to-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div 
          className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-emerald-400 to-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30"
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div 
          className="absolute bottom-20 left-1/2 w-96 h-96 bg-gradient-to-r from-pink-400 to-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col justify-center min-h-screen">
        <div className="container mx-auto px-6 text-center">
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <span className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm text-emerald-700 rounded-full text-sm font-semibold border border-emerald-200 shadow-lg">
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="mr-2"
              >
                🚀
              </motion.span>
              Powered by Solana
            </span>
          </motion.div>
          
          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight tracking-tight">
              Predict the future
              <br />
              <span className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                in a flick
              </span>
            </h1>
          </motion.div>
          
          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl mb-12 text-slate-600 max-w-2xl mx-auto leading-relaxed font-light"
          >
            The simplest way to predict crypto prices.
            <br />
            <span className="font-semibold text-slate-800">Just swipe and win.</span>
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-20"
          >
            <Link href="/app/predictions">
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 40px -12px rgba(16, 185, 129, 0.4)"
                }}
                whileTap={{ scale: 0.95 }}
                className="group relative inline-flex items-center justify-center px-12 py-5 text-xl font-bold text-white bg-gradient-to-r from-emerald-500 to-blue-600 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
                <span className="relative z-10 flex items-center gap-3">
                  Launch App
                  <motion.svg 
                    className="w-6 h-6" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </motion.svg>
                </span>
              </motion.button>
            </Link>
          </motion.div>

          {/* Quick Features */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            <motion.div
              whileHover={{ y: -5 }}
              className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg"
            >
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="font-bold text-slate-800 mb-2">Instant</h3>
              <p className="text-slate-600 text-sm">One swipe to place your bet</p>
            </motion.div>
            
            <motion.div
              whileHover={{ y: -5 }}
              className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg"
            >
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="font-bold text-slate-800 mb-2">Simple</h3>
              <p className="text-slate-600 text-sm">Just predict up or down</p>
            </motion.div>
            
            <motion.div
              whileHover={{ y: -5 }}
              className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg"
            >
              <div className="text-3xl mb-3">💰</div>
              <h3 className="font-bold text-slate-800 mb-2">Profitable</h3>
              <p className="text-slate-600 text-sm">Win real rewards</p>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </div>
  )
}