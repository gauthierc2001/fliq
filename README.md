# Fliq - Crypto Prediction Market

A Tinder-style crypto prediction market where users swipe to predict price movements and compete on the leaderboard.

## Features

- **Live Crypto Markets**: Real-time prices from CoinGecko API
- **Tinder-Style Swipe UI**: Swipe left (NO), right (YES), or up (SKIP)
- **Quick Resolution**: 5, 15, and 30-minute prediction windows
- **Social Integration**: Connect Twitter/X for profile and leaderboard
- **Wallet-Based**: Solana wallet authentication required

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Animations**: Framer Motion
- **Wallet**: Solana Wallet Adapter
- **Database**: PostgreSQL with Prisma
- **APIs**: CoinGecko (crypto prices), Twitter OAuth 2.0

## Setup

### Environment Variables

Copy `env.template` to `.env.local` and fill in the values:

```bash
# Database - Railway PostgreSQL or local instance
DATABASE_URL="postgresql://user:password@host:port/database"

# JWT Secret - Generate a strong secret
JWT_SECRET="your_super_secret_jwt_key_change_in_production"

# Solana Network
NEXT_PUBLIC_SOLANA_NETWORK="devnet"  # or "mainnet-beta" for production

# CoinGecko API Key (optional but recommended)
COINGECKO_API_KEY="your-coingecko-api-key"

# Twitter OAuth 2.0 (for social features)
TWITTER_CLIENT_ID="your-twitter-client-id"
TWITTER_CLIENT_SECRET="your-twitter-client-secret"

# Base URL (for OAuth callbacks)
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

### Installation

```bash
# Install dependencies and dev
npm install
npx prisma generate
npx prisma db push
npm run dev

### Production build

```bash
# From a clean clone
npm install
npm run build
# Start
npm start
```

### Docker

```bash
docker build -t fliq:latest .
docker run -p 3000:3000 --env-file .env fliq:latest
```
```

## API Endpoints

### Markets
- `GET/POST /api/markets/generate` - Generate new markets from CoinGecko
- `GET /api/markets/list` - Get active markets
- `POST /api/cron/resolve` - Resolve expired markets
- `POST /api/cron/seed-markets` - Seed markets (legacy)

### Authentication
- `GET /api/auth/me` - Get current user
- `POST /api/auth/verify` - Verify wallet signature
- `GET /api/auth/nonce` - Get signing nonce
- `POST /api/auth/logout` - Logout user

### Twitter Integration
- `GET /api/auth/twitter` - Get Twitter OAuth URL
- `POST /api/auth/twitter` - Handle OAuth callback
- `GET /api/auth/twitter/callback` - OAuth redirect handler

### User & Betting
- `GET /api/user/history` - Get user betting history
- `POST /api/swipe` - Place a bet (swipe)
- `GET /api/leaderboard` - Get leaderboard with social profiles

## User Flow

1. **Landing Page**: Click "Launch App"
2. **Connect Wallet**: Solana wallet authentication
3. **Twitter Prompt**: Optional social connection (auto-prompted)
4. **Predict Markets**: Swipe/click on crypto predictions
5. **View Results**: Check profile and leaderboard

## Swipe Actions

### Interaction Methods
- **Mouse/Touch**: Drag cards left, right, or up
- **Buttons**: Click ← (NO), ↑ (SKIP), → (YES)
- **Keyboard**: A (NO), S/Space (SKIP), D (YES)

### Skip Logic Location
The Skip functionality is implemented in:
- `src/components/SwipeDeck.tsx` - UI component and interactions
- `src/app/app/predictions/page.tsx` - Skip state management
- Keyboard shortcuts: S key or Spacebar
- Swipe gesture: Upward swipe
- Button: Center ↑ button

## Market Generation

### CoinGecko Integration
- **Primary**: Live prices from CoinGecko API
- **Fallback**: Static markets if API unavailable
- **Rate Limiting**: Graceful degradation with warnings
- **Coins**: BTC, ETH, SOL, ADA, AVAX, LINK, MATIC, BNB

### Auto-Generation
Markets are automatically created when:
1. App launches with no active markets
2. User visits predictions page
3. Markets expire and need replacement

## Database Schema

```sql
-- User with social integration
model User {
  id            String   @id @default(cuid())
  wallet        String   @unique
  balance       Int      @default(1000)
  totalPnL      Int      @default(0)
  twitterId     String?  @unique
  twitterHandle String?
  twitterAvatar String?
  twitterName   String?
  swipes        Swipe[]
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

-- Prediction markets
model Market {
  id          String   @id @default(cuid())
  symbol      String   // coin symbol
  title       String   // prediction question
  durationMin Int      // 5, 15, or 30 minutes
  startTime   DateTime
  endTime     DateTime
  startPrice  Float
  endPrice    Float?
  resolved    Boolean  @default(false)
  outcome     Outcome? // YES, NO, PUSH
  yesBets     Int      @default(0)
  noBets      Int      @default(0)
  swipes      Swipe[]
  createdAt   DateTime @default(now())
}

-- User predictions/bets
model Swipe {
  id         String   @id @default(cuid())
  userId     String
  marketId   String
  side       Outcome  // YES or NO
  stake      Int      // bet amount
  payoutMult Float    // multiplier for winnings
  settled    Boolean  @default(false)
  win        Boolean?
  pnl        Int?     // profit/loss
  createdAt  DateTime @default(now())
  
  user   User   @relation(fields: [userId], references: [id])
  market Market @relation(fields: [marketId], references: [id])
}
```

## Rate Limits & API Considerations

### CoinGecko Free Tier
- **Limit**: 10-30 calls/minute
- **Fallback**: Static price data when rate limited
- **Handling**: Graceful degradation with user notifications

### Twitter API
- **OAuth 2.0**: Standard rate limits apply
- **User Data**: Cached after initial connection
- **Fallback**: App works without Twitter connection

## Production Deployment

1. Set environment variables
2. Use production database (Railway PostgreSQL recommended)
3. Set `NEXT_PUBLIC_SOLANA_NETWORK="mainnet-beta"`
4. Add your domain to Twitter OAuth settings
5. Update `NEXT_PUBLIC_BASE_URL` to your domain

## Troubleshooting

### No Markets Loading
1. Check CoinGecko API connectivity
2. Verify database connection
3. Check browser console for errors
4. Try manual market generation: `curl http://localhost:3000/api/markets/generate`

### Twitter Connection Issues
1. Verify OAuth credentials in environment
2. Check redirect URL in Twitter app settings
3. Ensure popup blockers are disabled

### Wallet Connection Problems
1. Ensure Solana wallet extension is installed
2. Check network setting (devnet vs mainnet)
3. Verify wallet has some SOL for transactions

## Architecture Notes

- **Client-side routing**: Next.js App Router
- **State management**: React hooks (no external state library)
- **Authentication**: JWT with wallet signatures
- **Database**: Prisma ORM with PostgreSQL
- **Styling**: Tailwind CSS with custom brand colors
- **Icons**: Lucide React (no emojis)