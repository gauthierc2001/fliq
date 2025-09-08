# Fliq - Predict the Future in a Flick 🚀

A production-ready Solana wallet-based prediction market app with mobile-first swipe UX, built with Next.js 14 and designed for seamless Railway deployment.

## 🎯 Features

- **Mobile-First Swipe UX**: Tinder-like interface for predictions (swipe left = NO, right = YES)
- **Solana Wallet Authentication**: Support for Phantom, Solflare, and Backpack wallets
- **Real-Time Markets**: Bitcoin, Ethereum, and Solana price prediction markets
- **Credits System**: Start with 1,000 $FLIQ, bet 100 $FLIQ per prediction
- **Dynamic Odds**: Odds calculated based on market sentiment
- **Leaderboard**: Rankings by total P&L and current balance
- **Auto-Resolution**: Markets resolve automatically using CoinGecko price feeds

## 🏗️ Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (Railway)
- **Blockchain**: Solana Web3.js, Wallet Adapter
- **Deployment**: Docker, Railway
- **Authentication**: JWT with Solana signature verification

## 🚀 Quick Start

### Local Development

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd fliq
   npm install
   ```

2. **Set up environment variables**
   ```bash
   # Copy and configure environment variables
   DATABASE_URL="postgresql://user:pass@localhost:5432/fliq"
   JWT_SECRET="your_super_secret_jwt_key"
   NEXT_PUBLIC_SOLANA_NETWORK="mainnet-beta"
   COINGECKO_API_KEY="optional_api_key"
   ```

3. **Set up database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run migrations
   npx prisma migrate dev
   
   # Optional: Seed initial markets
   npm run db:seed
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

Visit [http://localhost:3000](http://localhost:3000) to see the app.

### Railway Deployment

This app is designed for one-click Railway deployment. See [railway-deploy.md](./railway-deploy.md) for detailed instructions.

**Quick Deploy:**
1. Push code to GitHub
2. Create Railway project
3. Add PostgreSQL database
4. Set environment variables
5. Deploy
6. Set up cron jobs for market resolution

## 📱 App Flow

### Landing Page (`/`)
- Hero section with "Predict the future in a flick"
- Connect wallet CTA
- Features overview and how-it-works

### Predictions (`/app/predictions`)
- Swipeable market cards
- Real-time odds and multipliers
- Balance display and bet placement
- Mobile-optimized touch gestures

### User Profile (`/app/user`)
- Wallet balance and total P&L
- Betting history with outcomes
- Win rate and performance stats

### Leaderboard (`/app/leaderboard`)
- Top 100 users by total P&L
- Anonymized wallet addresses
- Real-time rankings

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/nonce` - Generate signing nonce
- `POST /api/auth/verify` - Verify wallet signature
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Clear session

### Markets & Betting
- `GET /api/markets/list` - Fetch active markets
- `POST /api/swipe` - Place bet (100 $FLIQ)
- `GET /api/user/history` - User betting history
- `GET /api/leaderboard` - Top users ranking

### Cron Jobs
- `POST /api/cron/resolve` - Resolve ended markets
- `POST /api/cron/seed-markets` - Create new markets
- `GET /api/prices/[symbol]` - Fetch current prices

## 🎲 Betting Mechanics

### Odds Calculation
```javascript
yesShare = yesBets / (yesBets + noBets)
yesMultiplier = 2 - yesShare
noMultiplier = 2 - noShare
```

### Market Resolution
- **YES**: Price goes up → YES bets win
- **NO**: Price goes down → NO bets win  
- **PUSH**: Price unchanged → Refund all bets

### Payouts
- Winner receives: `stake × multiplier`
- Net P&L: `(stake × multiplier) - stake`

## 🗄️ Database Schema

```sql
-- Users start with 1,000 $FLIQ balance
User {
  id        String   @id @default(cuid())
  wallet    String   @unique
  balance   Int      @default(1000)
  totalPnL  Int      @default(0)
  swipes    Swipe[]
}

-- Markets for BTC/ETH/SOL with 10m/30m/1h durations
Market {
  id          String   @id @default(cuid())
  symbol      String   // 'bitcoin','ethereum','solana'
  title       String   // 'BTC ↑ in 10m?'
  startPrice  Float
  endPrice    Float?
  resolved    Boolean  @default(false)
  outcome     Outcome? // YES/NO/PUSH
  yesBets     Int      @default(0)
  noBets      Int      @default(0)
}

-- Individual bets (100 $FLIQ each)
Swipe {
  side       Outcome  // YES/NO
  stake      Int      // Always 100
  payoutMult Float    // Locked-in multiplier
  settled    Boolean  @default(false)
  win        Boolean?
  pnl        Int?     // Profit/loss amount
}
```

## 🔐 Security Features

- **Signature Verification**: Nonce-based Solana signature authentication
- **Session Management**: Secure HTTP-only JWT cookies
- **Nonce Expiry**: 5-minute nonce validity window
- **Input Validation**: All API endpoints validate inputs
- **Database Transactions**: Atomic bet placement and balance updates

## 📊 Market Lifecycle

1. **Creation**: Auto-seeded every 5 minutes for BTC/ETH/SOL
2. **Active Betting**: Users can swipe/bet while market is open
3. **Resolution**: Prices fetched from CoinGecko at end time
4. **Settlement**: Winning bets paid out, balances updated
5. **Cleanup**: New markets created for next time slots

## 🛠️ Development Commands

```bash
# Database
npm run db:migrate     # Run Prisma migrations
npm run db:studio      # Open Prisma Studio
npm run db:seed        # Seed initial markets

# Development  
npm run dev            # Start dev server
npm run build          # Build for production
npm run start          # Start production server

# Linting
npm run lint           # ESLint check
```

## 🚧 Production Considerations

### Environment Variables
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Strong secret for JWT signing
- `NEXT_PUBLIC_SOLANA_NETWORK` - mainnet-beta for production
- `COINGECKO_API_KEY` - Optional for higher rate limits

### Cron Jobs (Railway)
- **Market Resolution**: Every 1 minute
- **Market Seeding**: Every 5 minutes

### Performance
- Database indexes on frequently queried fields
- Optimized Prisma queries with specific selects
- React.memo for expensive components
- Next.js standalone output for Docker

## 📈 Scalability

- **Database**: PostgreSQL with connection pooling
- **Caching**: Redis can be added for market data
- **CDN**: Static assets served via Railway CDN
- **Monitoring**: Built-in error handling and logging

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

---

**Ready to predict the future?** Deploy to Railway and start swiping! 🎯