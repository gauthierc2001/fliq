import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800">
      <div className="container mx-auto px-4 py-16 text-center text-white">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Predict the future
            <br />
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              in a flick
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-12 text-purple-100 max-w-2xl mx-auto leading-relaxed">
            Swipe to predict crypto price movements. Win credits with accurate predictions. 
            Powered by Solana wallets.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/app/predictions"
              className="px-8 py-4 bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold text-lg rounded-2xl hover:from-green-500 hover:to-blue-600 transition-all transform hover:scale-105 shadow-xl"
            >
              Launch App
            </Link>
            <Link
              href="/app/leaderboard"
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold text-lg rounded-2xl hover:bg-white/20 transition-all border border-white/20"
            >
              View Leaderboard
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-xl font-bold mb-3">Mobile-First</h3>
            <p className="text-purple-100">
              Swipe left for NO, right for YES. Simple, intuitive, and addictive.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-3">Solana Powered</h3>
            <p className="text-purple-100">
              Connect your Phantom, Solflare, or Backpack wallet. No gas fees, instant settlements.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold mb-3">Real-Time Markets</h3>
            <p className="text-purple-100">
              Predict BTC, ETH, and SOL price movements over 10m, 30m, and 1h timeframes.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">How It Works</h2>
          
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div className="mb-8">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                1
              </div>
              <h4 className="font-semibold mb-2">Connect Wallet</h4>
              <p className="text-sm text-purple-200">Sign in with your Solana wallet</p>
            </div>
            
            <div className="mb-8">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                2
              </div>
              <h4 className="font-semibold mb-2">Choose Market</h4>
              <p className="text-sm text-purple-200">Pick a crypto and timeframe</p>
            </div>
            
            <div className="mb-8">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                3
              </div>
              <h4 className="font-semibold mb-2">Swipe Prediction</h4>
              <p className="text-sm text-purple-200">Left for down, right for up</p>
            </div>
            
            <div className="mb-8">
              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                4
              </div>
              <h4 className="font-semibold mb-2">Win Credits</h4>
              <p className="text-sm text-purple-200">Earn $FLIQ based on odds</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold mb-6">Start with 1,000 $FLIQ</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-400">100</div>
              <div className="text-sm text-purple-200">$FLIQ per bet</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">2.0x</div>
              <div className="text-sm text-purple-200">Max multiplier</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400">∞</div>
              <div className="text-sm text-purple-200">Possibilities</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}