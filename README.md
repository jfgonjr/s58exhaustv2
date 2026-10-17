# Divina S58 Quad-Tip Exhaust

Next.js 14 (App Router, TypeScript), Tailwind, Framer Motion, React Three Fiber, Web Audio API.

## Run locally
```bash
npm install
npm run dev     # http://localhost:3000
```

## Deploy to Vercel
1. Push this folder to a GitHub repository.
2. On vercel.com choose **Add New > Project** and import the repository.
3. Leave the defaults (Framework: Next.js, build `next build`). No environment variables are needed.
4. Click **Deploy**.
5. Put your spec sheet at `public/divina-s58-spec-sheet.pdf` so the download button works.
6. Inquiries post to `app/api/inquiry/route.ts`. Connect it to your email or CRM service there.

CLI alternative: `npm i -g vercel && vercel --prod`.

Audio starts only after you press **Start engine** (browsers require a user gesture).
