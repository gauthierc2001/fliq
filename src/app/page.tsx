'use client'

import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { 
  ArrowRight, 
  Wallet, 
  TrendingUp, 
  Clock, 
  Trophy, 
  Users, 
  Star,
  CheckCircle,
  Zap,
  Target,
  DollarSign,
  Calendar,
  Globe,
  Shield
} from 'lucide-react'
import { useRef } from 'react'

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <div ref={containerRef} className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <motion.div 
          style={{ y, opacity }}
          className="absolute inset-0 bg-gradient-to-br from-brand-green/5 via-white to-brand-green/5"
        >
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
        </motion.div>

        <div className="relative z-10 container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight tracking-tight text-brand-black">
              Swipe. Predict. Settle fast.
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-brand-gray max-w-3xl mx-auto leading-relaxed font-light">
              Short-horizon prediction markets on Solana, powered by <span className="font-bold text-brand-green">$FLIQ</span>.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
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
        </div>
      </section>

      {/* What is Fliq Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-8 text-brand-black">
              What is Fliq?
            </h2>
            <p className="text-xl md:text-2xl text-brand-gray leading-relaxed">
              A swipe-first prediction app. Take a side with one thumb—YES or NO—and see results in minutes, not days.
            </p>
          </motion.div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="py-20 bg-brand-bgGray">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-8 text-brand-black">
              How it works
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Wallet,
                title: "Connect a Solana wallet",
                description: "Phantom, Solflare, Backpack."
              },
              {
                icon: Target,
                title: "Pick a market card",
                description: "e.g., \"BTC higher in 30 minutes?\""
              },
              {
                icon: TrendingUp,
                title: "Swipe right for YES or left for NO",
                description: "using $FLIQ."
              },
              {
                icon: Clock,
                title: "When time's up",
                description: "outcomes settle and balances update automatically."
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="text-center p-8 bg-white rounded-2xl shadow-lg border border-brand-border"
              >
                <div className="w-16 h-16 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-6">
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-brand-black mb-4">{step.title}</h3>
                <p className="text-brand-gray">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why it's different Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-8 text-brand-black">
              Why it's different
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: Zap,
                title: "One-thumb UX",
                description: "no charts, no order books."
              },
              {
                icon: Clock,
                title: "Short markets",
                description: "10m, 30m, 1h."
              },
              {
                icon: CheckCircle,
                title: "Clear outcomes",
                description: "you always know what you're predicting and when it resolves."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="text-center p-8 bg-brand-bgGray rounded-2xl"
              >
                <div className="w-16 h-16 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-brand-black mb-4">{feature.title}</h3>
                <p className="text-brand-gray">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* $FLIQ Token Section */}
      <section className="py-20 bg-gradient-to-br from-brand-green/5 to-brand-green/10">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-8 text-brand-black">
              $FLIQ
            </h2>
            <p className="text-xl md:text-2xl text-brand-gray leading-relaxed mb-12">
              The token used to play and settle on Fliq.
            </p>
            <p className="text-lg text-brand-gray mb-8">
              Fliq Labs purchased 5% of supply at launch to support early programs and long-term alignment.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Fees & Alignment Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-8 text-brand-black">
              Fees & alignment
            </h2>
            <p className="text-xl text-brand-gray leading-relaxed mb-6">
              A simple 2% fee is taken from winning payouts.
            </p>
            <p className="text-lg text-brand-gray">
              Fees are used to buy back $FLIQ on-chain, linking activity on Fliq to demand for the token.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Test Hour Section */}
      <section className="py-20 bg-gradient-to-r from-brand-green to-brand-greenDark text-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-8">
              Test Hour (coming very soon)
            </h2>
            <p className="text-xl mb-8 leading-relaxed">
              Right after the $FLIQ launch we'll run a 60-minute Test Hour.
            </p>
            <div className="space-y-4 text-lg">
              <p>• Play short markets with $FLIQ.</p>
              <p>• Leaderboard airdrop: the more $FLIQ you finish the hour with, the bigger your allocation.</p>
              <p>• Full rules and start time announced shortly.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Profiles & Leaderboard Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-8 text-brand-black">
              Profiles & Leaderboard
            </h2>
            <p className="text-xl text-brand-gray leading-relaxed">
              Track your calls, streaks, and results. See how you rank against everyone else.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="py-20 bg-brand-bgGray">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-8 text-brand-black">
              Roadmap
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: "Now",
                items: [
                  "Crypto up/down markets (BTC, ETH, SOL).",
                  "Swipe deck, fast settles, profiles, leaderboard."
                ]
              },
              {
                title: "Next",
                items: [
                  "News & culture: high-signal headlines with clear, verifiable outcomes.",
                  "Sports & esports: match outcomes and live micro-windows.",
                  "Entertainment & awards: major releases, finals, ceremonies.",
                  "Politics (curated): key election checkpoints and debate outcomes where permitted.",
                  "More time windows (still short), improved discovery, and featured \"live moments.\""
                ]
              },
              {
                title: "Later",
                items: [
                  "Community-submitted markets with curation.",
                  "Broader politics & macro coverage (region-aware).",
                  "Head-to-head lobbies, social squads, and creator seasons.",
                  "Variable stakes and deeper stats, while keeping the one-thumb flow."
                ]
              }
            ].map((phase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-lg border border-brand-border"
              >
                <h3 className="text-2xl font-bold text-brand-black mb-6">{phase.title}</h3>
                <ul className="space-y-3 text-brand-gray">
                  {phase.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-brand-green mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center text-brand-gray mt-12 text-sm"
          >
            Availability of categories may vary by region.
          </motion.p>
        </div>
      </section>

      {/* Wallets & Availability Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-6">
                <Wallet className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-brand-black mb-4">Wallets</h3>
              <p className="text-brand-gray">Works with Phantom, Solflare, and Backpack.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-brand-black mb-4">Availability</h3>
              <p className="text-brand-gray">Access may be limited in some regions. Please review Terms before playing.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-brand-green/5 to-brand-green/10">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-8 text-brand-black">
              Ready to swipe a side?
            </h2>
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
      </section>
    </div>
  )
}