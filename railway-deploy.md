# Railway Deployment Guide for Fliq

## Prerequisites
1. Railway account at [railway.app](https://railway.app)
2. GitHub repository with this code

## Deployment Steps

### 1. Create Railway Project
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Create new project
railway new
```

### 2. Add PostgreSQL Database
1. Go to your Railway dashboard
2. Click "New" -> "Database" -> "PostgreSQL"
3. Note the DATABASE_URL from the variables tab

### 3. Set Environment Variables
In Railway dashboard, add these variables:

```
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=your_super_secret_jwt_key_here
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
COINGECKO_API_KEY=(optional)
```

### 4. Deploy Application
```bash
# Connect to Railway project
railway link

# Deploy
railway up
```

### 5. Run Database Migrations
```bash
# After first deploy, run migrations
railway run npx prisma migrate deploy
```

### 6. Set up Cron Jobs
1. Go to Railway dashboard -> your project
2. Create new service -> "Empty Service"
3. Name it "Market Resolver"
4. Set source to "Cron Job"
5. Set schedule: `* * * * *` (every minute)
6. Set command: `curl -X POST https://your-app.railway.app/api/cron/resolve`

7. Create another cron service "Market Seeder"
8. Set schedule: `*/5 * * * *` (every 5 minutes)  
9. Set command: `curl -X POST https://your-app.railway.app/api/cron/seed-markets`

### 7. Custom Domain (Optional)
1. Go to Settings -> Domains
2. Add your custom domain
3. Configure DNS records as shown

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `JWT_SECRET` | Secret for JWT token signing | Yes |
| `NEXT_PUBLIC_SOLANA_NETWORK` | Solana network (mainnet-beta/devnet) | Yes |
| `COINGECKO_API_KEY` | CoinGecko API key for price data | No |

## Post-Deployment

1. Visit your app URL
2. Connect a Solana wallet
3. Markets will be auto-seeded every 5 minutes
4. Market resolution happens every minute

## Troubleshooting

### Database Connection Issues
```bash
# Check database connection
railway run npx prisma studio
```

### Migration Issues
```bash
# Reset database (CAREFUL - this deletes all data)
railway run npx prisma migrate reset

# Or run migrations manually
railway run npx prisma migrate deploy
```

### Environment Variables
```bash
# List all variables
railway variables

# Add variable
railway variables set KEY=value
```

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Railway App   │    │   PostgreSQL     │    │   Cron Jobs     │
│   (Next.js)     │────│   Database       │    │   (Resolution)  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                                              │
         └──────────────────────────────────────────────┘
                    API calls every minute
```

The app will be production-ready immediately after deployment with:
- ✅ Solana wallet authentication
- ✅ Real-time price markets
- ✅ Automatic market creation and resolution  
- ✅ Mobile-optimized swipe interface
- ✅ Leaderboard and user profiles
