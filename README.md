# Leeds Harvard Referencer — Full Deployment Guide

## ✅ Features

- Fully supports 12 main Leeds Harvard reference formats and subvariants
- Dynamically fetches missing metadata via multi-API fallback chains
- Supports placeholder injection for test cases (e.g., JSTOR simulation)
- Secure API key handling via .env
- Deployable via Render or Node.js locally

## 📁 Files

- `index.html` — Frontend UI
- `referenceEngine.js` — Reference logic and formatter
- `server.js` — Proxy API handler with Google Search API
- `.env` — Store API keys securely (rename `.env.real` → `.env`)
- `package.json` — Node dependency config

## 🔧 Local Setup

1. Rename `.env.real` to `.env`
2. Run `npm install`
3. Start server with `node server.js`

Ready for deployment!

---

Creating the ZIP now...