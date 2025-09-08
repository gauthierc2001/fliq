import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16 text-center">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-gray-900">
            Predict the future
            <br />
            <span className="text-green-500">
              in a flick
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-12 text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Swipe to predict crypto price movements. Win credits with accurate predictions. 
            Powered by Solana wallets.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/app/predictions"
              className="px-8 py-4 bg-green-500 text-white font-bold text-lg rounded-2xl hover:bg-green-600 transition-all transform hover:scale-105 shadow-lg"
            >
              Launch App
            </Link>
            <Link
              href="/app/leaderboard"
              className="px-8 py-4 bg-white text-gray-900 font-semibold text-lg rounded-2xl hover:bg-gray-100 transition-all border-2 border-gray-200"
            >
              View Leaderboard
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-2xl p-8 border border-fliq-border shadow-sm hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-xl font-bold mb-3 text-fliq-dark">Mobile-First</h3>
            <p className="text-fliq-gray">
              Swipe left for NO, right for YES. Simple, intuitive, and addictive.
            </p>
          </div>
          
          <div className="bg-white rounded-2xl p-8 border border-fliq-border shadow-sm hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-3 text-fliq-dark">Solana Powered</h3>
            <p className="text-fliq-gray">
              Connect your Phantom, Solflare, or Backpack wallet. No gas fees, instant settlements.
            </p>
          </div>
          
          <div className="bg-white rounded-2xl p-8 border border-fliq-border shadow-sm hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold mb-3 text-fliq-dark">Real-Time Markets</h3>
            <p className="text-fliq-gray">
              Predict BTC, ETH, and SOL price movements over 10m, 30m, and 1h timeframes.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="max-w-4xl mx-auto bg-fliq-bg-gray rounded-3xl p-12">
          <h2 className="text-3xl font-bold mb-12 text-fliq-dark">How It Works</h2>
          
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div className="mb-8">
              <div className="w-16 h-16 bg-fliq-green rounded-full flex items-center justify-center mx-auto mb-4 text-2xl text-white font-bold">
                1
              </div>
              <h4 className="font-semibold mb-2 text-fliq-dark">Connect Wallet</h4>
              <p className="text-sm text-fliq-gray">Sign in with your Solana wallet</p>
            </div>
            
            <div className="mb-8">
              <div className="w-16 h-16 bg-fliq-green rounded-full flex items-center justify-center mx-auto mb-4 text-2xl text-white font-bold">
                2
              </div>
              <h4 className="font-semibold mb-2 text-fliq-dark">Choose Market</h4>
              <p className="text-sm text-fliq-gray">Pick a crypto and timeframe</p>
            </div>
            
            <div className="mb-8">
              <div className="w-16 h-16 bg-fliq-green rounded-full flex items-center justify-center mx-auto mb-4 text-2xl text-white font-bold">
                3
              </div>
              <h4 className="font-semibold mb-2 text-fliq-dark">Swipe Prediction</h4>
              <p className="text-sm text-fliq-gray">Left for down, right for up</p>
            </div>
            
            <div className="mb-8">
              <div className="w-16 h-16 bg-fliq-green rounded-full flex items-center justify-center mx-auto mb-4 text-2xl text-white font-bold">
                4
              </div>
              <h4 className="font-semibold mb-2 text-fliq-dark">Win Credits</h4>
              <p className="text-sm text-fliq-gray">Earn $FLIQ based on odds</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 bg-white rounded-2xl p-8 border border-fliq-border shadow-sm max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold mb-6 text-fliq-dark">Start with 1,000 $FLIQ</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-fliq-green">100</div>
              <div className="text-sm text-fliq-gray">$FLIQ per bet</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-fliq-green">2.0x</div>
              <div className="text-sm text-fliq-gray">Max multiplier</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-fliq-green">∞</div>
              <div className="text-sm text-fliq-gray">Possibilities</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}