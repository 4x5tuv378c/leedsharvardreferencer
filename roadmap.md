# 🧠 Leeds Harvard Referencer: Integration Roadmap

This roadmap outlines the current progress and future tasks for completing full functionality of the reference generation platform.

---

## ✅ CURRENTLY COMPLETE

### 🧩 Functional Logic (referenceEngine.js)
- [x] Full support for 12 core formats (journal, book, ebook, etc.)
- [x] Subvariant handling via `FORMAT_FIELDS`
- [x] Metadata merging logic from API fallback
- [x] JSTOR test injection for known test case
- [x] Citation formatting per Leeds Harvard structure

### 🌐 Proxy Server (server.js)
- [x] Fully working CORS proxy using Express and Node
- [x] Live integration with Google Search API
- [x] `.env` support for API keys
- [x] Ready for expansion to other APIs

### 📁 Deployment Package
- [x] Zip includes all code: referenceEngine.js, index.html, server.js, .env
- [x] README.md with setup instructions

---

## 🔜 TO BE IMPLEMENTED

### 🖼️ Frontend (index.html)
- [ ] Add dynamic input fields based on selected format
- [ ] Add `showFieldsForFormat(format)` invocation
- [ ] Validate required fields (e.g. title)

### 🔄 Proxy Routes (server.js)
Add support for these APIs as placeholders:

| API                | Placeholder Route    | Auth Required? | Notes                      |
|--------------------|----------------------|----------------|----------------------------|
| CrossRef           | /crossref            | ❌ No           | Already supported          |
| Semantic Scholar   | /semantic-scholar    | ❌ No           | Already supported          |
| Scopus             | /scopus              | ✅ Yes          | Needs key and route logic |
| ProQuest           | /proquest            | ✅ Yes          | Institutional login       |
| JSTOR              | /jstor               | ✅ Yes          | Simulated currently       |
| Springer           | /springer            | ✅ Yes          | Needs JSON normalizer     |
| Elsevier           | /elsevier            | ✅ Yes          | Via API gateway           |
| Taylor & Francis   | /taylorfrancis       | ✅ Yes          | Academic login             |
| Cambridge          | /cambridge           | ✅ Yes          | Library portal access     |
| WorldCat           | /worldcat            | ✅ Yes          | OCLC credentials needed   |
| Open Library       | /open-library        | ❌ No           | Public JSON search        |

---

## 🧪 Testing
- [ ] Add multi-source merging test logic
- [ ] Improve debug output visualization
- [ ] Log missing fields and fallback sequence

---

## 🛡️ Deployment
- [ ] Finalize `.env` security config
- [ ] Add `.env.example` to ZIP
- [ ] Add deployment-specific README tips