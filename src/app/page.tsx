'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Zap, Target, DollarSign, TrendingUp, Clock, Trophy, Users, BarChart3, Shield } from 'lucide-react'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-white">
        <motion.div 
          className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-brand-green/10 to-brand-green/5 rounded-full mix-blend-multiply filter blur-xl opacity-60"
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
          className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-brand-green/8 to-brand-green/3 rounded-full mix-blend-multiply filter blur-xl opacity-60"
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
      </div>

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex flex-col justify-center">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight text-black">
              Swipe. Predict.
              <br />
              <span className="bg-gradient-to-r from-brand-green to-brand-green bg-clip-text text-transparent">
                Settle fast.
              </span>
            </h1>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl mb-12 text-gray-700 max-w-3xl mx-auto leading-relaxed"
          >
            Short-horizon prediction markets on Solana powered by $FLIQ.
          </motion.p>

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
        </div>
      </section>

      {/* What is Fliq Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 bg-white"
      >
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-8 text-black">What is Fliq?</h2>
            <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              A swipe-first prediction app. Take a side with one thumb — YES or NO — and see results in minutes not days.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* How it works Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 bg-gray-50"
      >
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-center mb-16 text-black"
          >
            How it works
          </motion.h2>
          
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="text-center p-6">
              <div className="w-16 h-16 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <p className="text-gray-700">Connect a Solana wallet (Phantom Solflare Backpack).</p>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="text-center p-6">
              <div className="w-16 h-16 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <p className="text-gray-700">Pick a market card (e.g. "BTC higher in 3 minutes?").</p>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="text-center p-6">
              <div className="w-16 h-16 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <p className="text-gray-700">Swipe right for YES or left for NO using $FLIQ.</p>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="text-center p-6">
              <div className="w-16 h-16 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">4</span>
              </div>
              <p className="text-gray-700">When time's up outcomes settle and balances update automatically.</p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Why it's different Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 bg-white"
      >
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-center mb-16 text-black"
          >
            Why it's different
          </motion.h2>
          
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="text-center p-6">
              <Zap className="w-12 h-12 text-brand-green mx-auto mb-4" />
              <h3 className="font-bold text-xl mb-3 text-black">One-thumb UX</h3>
              <p className="text-gray-700">No charts no order books.</p>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="text-center p-6">
              <Clock className="w-12 h-12 text-brand-green mx-auto mb-4" />
              <h3 className="font-bold text-xl mb-3 text-black">Short markets</h3>
              <p className="text-gray-700">1m 3m 5m.</p>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="text-center p-6">
              <Target className="w-12 h-12 text-brand-green mx-auto mb-4" />
              <h3 className="font-bold text-xl mb-3 text-black">Clear outcomes</h3>
              <p className="text-gray-700">You always know what you're predicting and when it resolves.</p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* $FLIQ Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 bg-gray-50"
      >
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-8 text-black">$FLIQ</h2>
            <p className="text-xl md:text-2xl text-gray-700 mb-6 leading-relaxed">
              The token used to play and settle on Fliq.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Fliq Labs will purchase 5% of supply at launch to support early programs and long-term alignment.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Fees & alignment Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 bg-white"
      >
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-8 text-black">Fees & alignment</h2>
            <p className="text-xl md:text-2xl text-gray-700 mb-6 leading-relaxed">
              A simple 2% fee is taken from winning payouts.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Fees are used to buy back $FLIQ on-chain linking activity on Fliq to demand for the token.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Test Hour Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 bg-gray-50"
      >
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-8 text-black">Test Hour (coming very soon)</h2>
            <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
              <p>Right after the $FLIQ launch we'll run a 60-minute Test Hour.</p>
              <p>Play short markets with $FLIQ.</p>
              <p>Leaderboard airdrop: the more $FLIQ you finish the hour with the bigger your allocation.</p>
              <p className="font-semibold">Full rules and start time announced shortly.</p>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Profiles & Leaderboard Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 bg-white"
      >
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-8 text-black">Profiles & Leaderboard</h2>
            <p className="text-xl md:text-2xl text-gray-700 leading-relaxed">
              Track your calls streaks and results. See how you rank against everyone else.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Roadmap Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 bg-gray-50"
      >
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-center mb-16 text-black"
          >
            Roadmap
          </motion.h2>
          
          <div className="max-w-4xl mx-auto space-y-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl shadow-lg"
            >
              <h3 className="text-2xl font-bold mb-4 text-black">Now</h3>
              <p className="text-lg text-gray-700 mb-4">Crypto up/down markets (BTC ETH SOL).</p>
              <p className="text-lg text-gray-700">Swipe deck fast settles profiles leaderboard.</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl shadow-lg"
            >
              <h3 className="text-2xl font-bold mb-4 text-black">Next</h3>
              <div className="space-y-2 text-lg text-gray-700">
                <p>News & culture: high-signal headlines with clear verifiable outcomes.</p>
                <p>Sports & esports: match outcomes and live micro-windows.</p>
                <p>Entertainment & awards: major releases finals ceremonies.</p>
                <p>Politics (curated): key election checkpoints and debate outcomes where permitted.</p>
                <p>More time windows (still short) improved discovery and featured "live moments."</p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl shadow-lg"
            >
              <h3 className="text-2xl font-bold mb-4 text-black">Later</h3>
              <div className="space-y-2 text-lg text-gray-700">
                <p>Community-submitted markets with curation.</p>
                <p>Broader politics & macro coverage (region-aware).</p>
                <p>Head-to-head lobbies social squads and creator seasons.</p>
                <p>Variable stakes and deeper stats while keeping the one-thumb flow.</p>
                <p className="italic">Availability of categories may vary by region.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Wallets Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 bg-white"
      >
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-8 text-black">Wallets</h2>
            <p className="text-xl md:text-2xl text-gray-700 leading-relaxed">
              Works with Phantom Solflare and Backpack.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Availability Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 bg-gray-50"
      >
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-8 text-black">Availability</h2>
            <p className="text-xl md:text-2xl text-gray-700 leading-relaxed">
              Access may be limited in some regions. Please review Terms before playing.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Final CTA Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 bg-white"
      >
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-8 text-black">Ready to swipe a side?</h2>
            <Link href="/app/predictions">
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 40px -12px rgba(108, 192, 74, 0.4)"
                }}
                whileTap={{ scale: 0.95 }}
                className="group relative inline-flex items-center justify-center px-12 py-5 text-xl font-bold text-white bg-brand-green rounded-2xl shadow-2xl overflow-hidden transition-all duration-300"
              >
                <span className="relative z-10 flex items-center gap-3">
                  Launch Fliq
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
        </div>
      </motion.section>
    </div>
  )
}