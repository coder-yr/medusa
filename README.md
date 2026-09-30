# doctorease

A modern, premium, glassmorphic healthcare platform built for next-generation patient care in Navi Mumbai, India. Designed for seamless appointment booking, live symptoms guidance, and 24/7 AI health companion assistance.

## Medora Platform MVP (`/medora`)
Frontend-only demo of the 14-module Medora platform. No backend: AI runs in the browser against Groq, data lives in localStorage.

- Run: `npm install && npm run dev` → open http://localhost:8080/medora → click the key icon → paste a Groq key (console.groq.com/keys).
- Models: `src/medora/groq.ts` (`llama-3.3-70b-versatile` text, `meta-llama/llama-4-scout-17b-16e-instruct` vision for report photos).
- Demo data (family profiles, London providers, analytics) is illustrative: `src/medora/data.ts`, `src/medora/store.ts`.
- Deploy: Vercel works as-is (`vercel.json` has the SPA rewrite). **Do not ship a real key in `VITE_GROQ_API_KEY` to a public URL** — production needs a small proxy.
