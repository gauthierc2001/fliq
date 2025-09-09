## 0.1.1 - Full Stability & Functional Audit

### Summary
- Fixed Next.js config build error by converting `next.config.ts` to `next.config.mjs`
- Aligned all dependencies to stable versions (Next.js 14.2.15, React 18.2.0, ESLint 8.57.0)
- Fixed all lint warnings and type errors
- Hardened API routes with input validation and better error handling
- Improved CoinGecko integration with timeout and retry logic
- Verified Tailwind CSS pipeline and brand consistency

### Build & Config
- **Next.js config**: Converted from TypeScript to ESM module (`.mjs`) to fix build error
- **Dependencies**: Downgraded from Next.js 15.5.2 to stable 14.2.15 LTS
- **Scripts**: Added `typecheck` command, `lint` now fails on warnings
- **Prisma**: Regenerated client to fix missing Twitter fields type errors

### Code Quality
- **Lint fixes**:
  - Removed unused `skippedMarkets` state in predictions page
  - Fixed React hooks exhaustive dependencies in `SwipeDeck` and `WalletConnectButton`
  - Removed unused `getCoinGeckoId` import in `marketGenerator.ts`
- **Type fixes**:
  - Fixed dynamic route params for Next.js 14 (non-Promise based)
  - Properly typed all API responses and Prisma queries

### Functional Improvements
- **API Security**:
  - Added proper input validation in `/api/swipe` route
  - Improved error messages for better debugging
- **CoinGecko Integration**:
  - Added 5-second timeout with AbortController
  - Implemented retry logic for rate limiting (429 errors)
  - Better error handling for missing prices
- **React Patterns**:
  - Wrapped event handlers with `useCallback` to prevent unnecessary re-renders
  - Fixed circular dependency in `WalletConnectButton` callbacks

### Infrastructure
- **Docker**: Updated to regenerate lockfile during build (`npm install` instead of `npm ci`)
- **Railway**: Confirmed environment variable setup and migration strategy

### Verification
- ✅ `npm run lint` - No errors or warnings
- ✅ `npm run typecheck` - All types valid
- ✅ `npm run build` - Production build succeeds
- ✅ Dependencies all on stable versions
- ✅ Tailwind CSS properly configured with brand colors

