
// api_chains.js — definitive fallback API chains per format
export const API_CHAINS = {
  book: ["openlibrary", "crossref", "googlebooks", "semantic", "worldcat", "jstor", "proquest", "scopus", "springer", "elsevier", "googlesearch"],
  journal: ["crossref", "semantic", "scopus", "elsevier", "springer", "proquest", "jstor", "worldcat", "googlescholar", "googlesearch"],
  ebook: ["openlibrary", "googlebooks", "crossref", "semantic", "worldcat", "proquest", "springer", "googlesearch"],
  thesis: ["proquest", "worldcat", "crossref", "googlesearch"],
  website: ["googlesearch", "customsearch"],
  bookchapter: ["crossref", "semantic", "proquest", "jstor", "springer", "googlesearch"],
  report: ["crossref", "worldcat", "proquest", "googlesearch"],
  newspaper: ["googlesearch", "customsearch"],
  pressrelease: ["googlesearch"],
  bill: ["congressgov", "govinfo", "googlesearch"],
  act: ["legislationgovuk", "googlesearch"],
  "senate-report-us": ["govinfo", "congressgov", "googlesearch"],
  "congress-hearing-us": ["govinfo", "congressgov", "googlesearch"]
};
