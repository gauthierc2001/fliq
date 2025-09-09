'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Rocket, Zap, Target, DollarSign, ArrowRight } from 'lucide-react'
import Image from 'next/image'

export default function HomePage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-white">
        {/* Floating Orbs - Updated to brand colors */}
        <motion.div 
          className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-brand-green/20 to-brand-green/10 rounded-full mix-blend-multiply filter blur-xl opacity-60"
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
          className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-brand-green/15 to-brand-green/5 rounded-full mix-blend-multiply filter blur-xl opacity-60"
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
          className="absolute bottom-20 left-1/2 w-96 h-96 bg-gradient-to-r from-brand-green/10 to-brand-green/5 rounded-full mix-blend-multiply filter blur-xl opacity-40"
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
            <span className="inline-flex items-center px-6 py-3 bg-white/90 backdrop-blur-sm text-brand-green rounded-full text-sm font-semibold border border-brand-green/20 shadow-lg">
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="mr-2"
              >
                <Rocket className="w-4 h-4 inline text-brand-green" />
              </motion.span>
              Powered by Solana
            </span>
          </motion.div>
          
          {/* Logo and Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <div className="mb-6">
              <Image 
                src="/logo.png" 
                alt="Fliq" 
                width={200} 
                height={100}
                className="h-16 w-auto mx-auto"
                priority
              />
            </div>
            <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight tracking-tight text-brand-black">
              Predict the future
              <br />
              <span className="bg-gradient-to-r from-brand-green to-brand-greenDark bg-clip-text text-transparent">
                in a flick
              </span>
            </h1>
          </motion.div>
          
          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl mb-12 text-brand-gray max-w-2xl mx-auto leading-relaxed font-light"
          >
            The simplest way to predict crypto prices.
            <br />
            <span className="font-semibold text-brand-black">Just swipe and win.</span>
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
                  boxShadow: "0 20px 40px -12px rgba(108, 192, 74, 0.4)"
                }}
                whileTap={{ scale: 0.95 }}
                className="group relative inline-flex items-center justify-center px-12 py-5 text-xl font-bold text-white bg-brand-green rounded-2xl shadow-2xl overflow-hidden transition-all duration-300"
              >
                <motion.div
                  className="absolute inset-0 bg-brand-greenDark opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
                <span className="relative z-10 flex items-center gap-3">
                  Launch App
                  <motion.div
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <ArrowRight className="w-6 h-6" />
                  </motion.div>
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
              <div className="text-3xl mb-3">
                <Zap className="w-8 h-8 text-brand-green mx-auto" />
              </div>
              <h3 className="font-bold text-brand-black mb-2">Instant</h3>
              <p className="text-brand-gray text-sm">One swipe to place your bet</p>
            </motion.div>
            
            <motion.div
              whileHover={{ y: -5 }}
              className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg"
            >
              <div className="text-3xl mb-3">
                <Target className="w-8 h-8 text-brand-green mx-auto" />
              </div>
              <h3 className="font-bold text-brand-black mb-2">Simple</h3>
              <p className="text-brand-gray text-sm">Just predict up or down</p>
            </motion.div>
            
            <motion.div
              whileHover={{ y: -5 }}
              className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg"
            >
              <div className="text-3xl mb-3">
                <DollarSign className="w-8 h-8 text-brand-green mx-auto" />
              </div>
              <h3 className="font-bold text-brand-black mb-2">Profitable</h3>
              <p className="text-brand-gray text-sm">Win real rewards</p>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </div>
  )
}