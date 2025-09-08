import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with animated gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>
      
      <div className="container mx-auto px-4 py-16 text-center relative z-10">
        {/* Hero Section */}
        <div className="max-w-5xl mx-auto">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-semibold mb-8">
              🚀 Powered by Solana
            </span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight">
            Predict the future
            <br />
            <span className="text-gradient-green float">
              in a flick
            </span>
          </h1>
          
          <p className="text-2xl md:text-3xl mb-16 text-slate-600 max-w-3xl mx-auto leading-relaxed font-light">
            Swipe to predict crypto price movements. Win rewards with accurate predictions. 
            <br className="hidden md:block" />
            <span className="font-semibold text-emerald-600">Simple. Fast. Profitable.</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
            <Link
              href="/app/predictions"
              className="btn-primary group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                🎯 Launch App
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
            <Link
              href="/app/leaderboard"
              className="btn-secondary group"
            >
              <span className="flex items-center justify-center gap-3">
                🏆 View Leaderboard
              </span>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 mb-20">
          <div className="card p-10 group hover:rotate-1 transition-all duration-500">
            <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">📱</div>
            <h3 className="text-2xl font-bold mb-4 text-slate-800">Mobile-First</h3>
            <p className="text-slate-600 text-lg leading-relaxed">
              Swipe left for NO, right for YES. Simple, intuitive, and addictive.
            </p>
          </div>
          
          <div className="card p-10 group hover:-rotate-1 transition-all duration-500">
            <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">⚡</div>
            <h3 className="text-2xl font-bold mb-4 text-slate-800">Solana Powered</h3>
            <p className="text-slate-600 text-lg leading-relaxed">
              Connect your Phantom, Solflare, or Backpack wallet. No gas fees, instant settlements.
            </p>
          </div>
          
          <div className="card p-10 group hover:rotate-1 transition-all duration-500">
            <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">🎯</div>
            <h3 className="text-2xl font-bold mb-4 text-slate-800">Real-Time Markets</h3>
            <p className="text-slate-600 text-lg leading-relaxed">
              Predict BTC, ETH, and SOL price movements over 10m, 30m, and 1h timeframes.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="max-w-6xl mx-auto card-gradient p-16 mb-20">
          <h2 className="text-4xl font-black mb-16 text-slate-800 text-center">How It Works</h2>
          
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl text-white font-black shadow-xl group-hover:scale-110 transition-transform duration-300">
                1
              </div>
              <h4 className="font-bold mb-3 text-slate-800 text-lg">Connect Wallet</h4>
              <p className="text-slate-600 leading-relaxed">Sign in with your Solana wallet securely</p>
            </div>
            
            <div className="group">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl text-white font-black shadow-xl group-hover:scale-110 transition-transform duration-300">
                2
              </div>
              <h4 className="font-bold mb-3 text-slate-800 text-lg">Choose Market</h4>
              <p className="text-slate-600 leading-relaxed">Pick a crypto and timeframe to predict</p>
            </div>
            
            <div className="group">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl text-white font-black shadow-xl group-hover:scale-110 transition-transform duration-300">
                3
              </div>
              <h4 className="font-bold mb-3 text-slate-800 text-lg">Swipe Prediction</h4>
              <p className="text-slate-600 leading-relaxed">Left for down, right for up movement</p>
            </div>
            
            <div className="group">
              <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl text-white font-black shadow-xl group-hover:scale-110 transition-transform duration-300">
                4
              </div>
              <h4 className="font-bold mb-3 text-slate-800 text-lg">Win Rewards</h4>
              <p className="text-slate-600 leading-relaxed">Earn $FLIQ tokens based on accuracy</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="max-w-4xl mx-auto card p-12 text-center">
          <h3 className="text-3xl font-black mb-10 text-slate-800">Start with 1,000 $FLIQ</h3>
          <div className="grid grid-cols-3 gap-8">
            <div className="group">
              <div className="text-4xl font-black text-emerald-600 mb-3 group-hover:scale-110 transition-transform">100</div>
              <div className="text-slate-600 font-semibold">$FLIQ per bet</div>
            </div>
            <div className="group">
              <div className="text-4xl font-black text-emerald-600 mb-3 group-hover:scale-110 transition-transform">2.0x</div>
              <div className="text-slate-600 font-semibold">Max multiplier</div>
            </div>
            <div className="group">
              <div className="text-4xl font-black text-emerald-600 mb-3 group-hover:scale-110 transition-transform">∞</div>
              <div className="text-slate-600 font-semibold">Possibilities</div>
            </div>
          </div>
          
          <div className="mt-10 pt-8 border-t border-slate-200">
            <p className="text-slate-500 text-sm">
              Ready to start earning? Connect your wallet and make your first prediction!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}