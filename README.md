This is a [Next.js](https://nextjs.org) project for `picify`, an AI scene-based image generation product.

## Engineering Baseline

- Runtime baseline: `Node.js >= 20.9.0`
- Package manager: `npm`
- Framework baseline: `Next.js 16 App Router`
- Quality gates: `Prettier`, `ESLint`, `TypeScript`, `next build`
- CI/CD: `GitHub Actions + Vercel`

## Getting Started

First, run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Available Scripts

- `npm run dev`: start local development server
- `npm run lint`: run ESLint
- `npm run lint:fix`: auto-fix lint problems where possible
- `npm run format`: format files with Prettier
- `npm run format:check`: verify formatting
- `npm run typegen`: generate Next.js route types
- `npm run typecheck`: generate route types and run TypeScript checks
- `npm run build`: create production build
- `npm run check`: run formatting, lint, typecheck, and build in sequence

## Deployment

- Pull requests should pass GitHub Actions quality checks.
- The main branch is intended for Vercel deployment.
- Environment variables for production should be configured in Vercel, not committed locally.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [App Router docs](https://nextjs.org/docs/app)
- Local Next.js docs snapshot: `node_modules/next/dist/docs/`
