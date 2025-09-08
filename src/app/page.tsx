import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16 text-center">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-fliq-dark">
            Predict the future
            <br />
            <span className="text-fliq-green">
              in a flick
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-12 text-fliq-gray max-w-2xl mx-auto leading-relaxed">
            Swipe to predict crypto price movements. Win credits with accurate predictions. 
            Powered by Solana wallets.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/app/predictions"
              className="px-8 py-4 bg-fliq-green text-white font-bold text-lg rounded-2xl hover:bg-green-600 transition-all transform hover:scale-105 shadow-lg"
            >
              Launch App
            </Link>
            <Link
              href="/app/leaderboard"
              className="px-8 py-4 bg-white text-fliq-dark font-semibold text-lg rounded-2xl hover:bg-fliq-bg-gray transition-all border-2 border-fliq-border"
            >
              View Leaderboard
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-2xl p-8 border border-[#E5E5E5] shadow-sm hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-xl font-bold mb-3 text-[#0F0F0F]">Mobile-First</h3>
            <p className="text-[#555555]">
              Swipe left for NO, right for YES. Simple, intuitive, and addictive.
            </p>
          </div>
          
          <div className="bg-white rounded-2xl p-8 border border-[#E5E5E5] shadow-sm hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-3 text-[#0F0F0F]">Solana Powered</h3>
            <p className="text-[#555555]">
              Connect your Phantom, Solflare, or Backpack wallet. No gas fees, instant settlements.
            </p>
          </div>
          
          <div className="bg-white rounded-2xl p-8 border border-[#E5E5E5] shadow-sm hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold mb-3 text-[#0F0F0F]">Real-Time Markets</h3>
            <p className="text-[#555555]">
              Predict BTC, ETH, and SOL price movements over 10m, 30m, and 1h timeframes.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="max-w-4xl mx-auto bg-[#F5F5F5] rounded-3xl p-12">
          <h2 className="text-3xl font-bold mb-12 text-[#0F0F0F]">How It Works</h2>
          
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div className="mb-8">
              <div className="w-16 h-16 bg-[#57C84D] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl text-white font-bold">
                1
              </div>
              <h4 className="font-semibold mb-2 text-[#0F0F0F]">Connect Wallet</h4>
              <p className="text-sm text-[#555555]">Sign in with your Solana wallet</p>
            </div>
            
            <div className="mb-8">
              <div className="w-16 h-16 bg-[#57C84D] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl text-white font-bold">
                2
              </div>
              <h4 className="font-semibold mb-2 text-[#0F0F0F]">Choose Market</h4>
              <p className="text-sm text-[#555555]">Pick a crypto and timeframe</p>
            </div>
            
            <div className="mb-8">
              <div className="w-16 h-16 bg-[#57C84D] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl text-white font-bold">
                3
              </div>
              <h4 className="font-semibold mb-2 text-[#0F0F0F]">Swipe Prediction</h4>
              <p className="text-sm text-[#555555]">Left for down, right for up</p>
            </div>
            
            <div className="mb-8">
              <div className="w-16 h-16 bg-[#57C84D] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl text-white font-bold">
                4
              </div>
              <h4 className="font-semibold mb-2 text-[#0F0F0F]">Win Credits</h4>
              <p className="text-sm text-[#555555]">Earn $FLIQ based on odds</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 bg-white rounded-2xl p-8 border border-[#E5E5E5] shadow-sm max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold mb-6 text-[#0F0F0F]">Start with 1,000 $FLIQ</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-[#57C84D]">100</div>
              <div className="text-sm text-[#555555]">$FLIQ per bet</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#57C84D]">2.0x</div>
              <div className="text-sm text-[#555555]">Max multiplier</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#57C84D]">∞</div>
              <div className="text-sm text-[#555555]">Possibilities</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}