## 0.1.1

Behavior-preserving repository hardening.

- Dependencies aligned to stable: Next 14.2.15, React 18.2, ESLint 8.x, Framer Motion 11.x
- Scripts: added typecheck; eslint now fails on warnings; production start runs standalone server.js
- Next config: removed incompatible 15+ option usage; kept image remotePatterns
- Fixed dynamic route params typing in `src/app/api/prices/[symbol]/route.ts`
- Prisma: stable singleton, safe DATABASE_URL query param append in prod
- Nonce: cryptographically strong randomness via `crypto.getRandomValues`
- Docker: add .dockerignore; ensure prod-only deps; keep migration on start; regenerate lockfile during build
- README: updated install/build instructions for dependency changes

