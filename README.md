## Greeting Quotes Generator

Generate 10 custom greeting quotes for common occasions (Happy Birthday, Wedding, Retirement, and more) or create your own with recipient details and optional "famous person" style.

### 1) Setup

1. Copy environment example and add your key:

```
cp .env.local.example .env.local
```

2. Set `OPENAI_API_KEY` in `.env.local`.

3. Install and run:

```
npm install
npm run dev
```

Open `http://localhost:3000`.

### 2) How it works

- UI lets you pick an occasion or enter a custom one, add recipient details, tone, language, and an optional famous person style.
- Server route `src/app/api/generate/route.ts` calls OpenAI and returns 10 quotes.

### 3) Deployment

#### GitHub

1. Push this folder to a GitHub repository.
2. Add repository secret `OPENAI_API_KEY`.

#### Azure App Service (Node)

This app uses Next.js App Router API routes, which require a Node server runtime.

1. Create an Azure App Service for Linux using Node 20+.
2. Set App Settings:
   - `OPENAI_API_KEY` = your key
   - `WEBSITE_NODE_DEFAULT_VERSION` = `~20`
3. Deployment options:
   - Use GitHub Actions (recommended) or Zip Deploy. For GH Actions, enable from the App Service Deployment Center.
4. Build/Start commands if prompted:
   - Build: `npm ci && npm run build`
   - Start: `npm run start`

#### Azure Static Web Apps (optional)

Static Web Apps require an API backend. You can still deploy by:

- Hosting the Next.js server in Azure Functions SSR (advanced), or
- Converting the API route to a Function and using SWA for the frontend (advanced).

For simplicity, use Azure App Service for this repository.

### 4) Environment

- `OPENAI_API_KEY` is required.

### 5) Notes

- Model: `gpt-4o-mini` for cost-effective quality.
- The API enforces JSON-only responses; it will coerce outputs as needed.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
