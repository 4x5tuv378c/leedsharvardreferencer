// referenceEngine.js - Debug-enhanced with full logs shown in debugOutput

const PROXY_BASE = "https://proxysiteforlhra.onrender.com";

const API_CHAINS = {
  journal: ["crossref", "semantic-scholar", "scopus", "proquest", "jstor", "springer", "wiley", "taylorfrancis", "cambridge", "open-library", "google-search"],
  book: ["crossref", "open-library", "google-books", "worldcat", "springer", "elsevier", "scopus", "proquest", "librarything", "semantic-scholar", "google-search"],
  ebook: ["crossref", "open-library", "google-books", "worldcat", "proquest", "ebrary", "vlebooks", "ebookcentral", "scopus", "semantic-scholar", "google-search"],
  bookchapter: ["crossref", "open-library", "google-books", "worldcat", "springer", "elsevier", "proquest", "ebrary", "semantic-scholar", "scopus", "google-search"],
  thesis: ["base", "ndltd", "open-library", "proquest", "semantic-scholar", "scopus", "ethos", "dspace", "worldcat", "crossref", "google-search"],
  website: ["microlink", "diffbot", "serpapi", "webit", "google-search", "open-library", "crossref", "semantic-scholar", "proquest", "bingnews"],
  report: ["crossref", "oecd", "govinfo", "world-bank", "unstats", "semantic-scholar", "open-library", "google-search", "proquest", "scopus"],
  pressrelease: ["guardianapi", "nytimesapi", "newsapi", "webit", "bingnews", "microlink", "google-search", "semantic-scholar", "crossref", "open-library"],
  newspaper: ["guardianapi", "nytimesapi", "newsapi", "webit", "google-search", "bingnews", "crossref", "semantic-scholar", "open-library", "proquest"],
  "senate-report-us": ["govinfo", "govtrack", "crossref", "semantic-scholar", "open-library", "proquest", "scopus", "worldcat", "google-search", "newsapi"],
  bill: ["govtrack", "govinfo", "crossref", "open-library", "semantic-scholar", "newsapi", "google-search", "proquest", "scopus", "worldcat"],
  act: ["govinfo", "crossref", "open-library", "govtrack", "worldcat", "semantic-scholar", "google-search", "newsapi", "proquest", "scopus"]
};

const FORMAT_FIELDS = {
  journal: ["author", "title", "year", "journal", "volume", "issue", "pages", "url"],
  book: ["author", "title", "year", "place", "publisher"],
  ebook: ["author", "title", "year", "place", "publisher", "url"],
  bookchapter: ["author", "title", "year", "editors", "bookTitle", "place", "publisher", "pages"],
  thesis: ["author", "title", "year", "publisher", "place"],
  website: ["author", "title", "year", "url"],
  report: ["author", "title", "year", "publisher", "place"],
  pressrelease: ["author", "title", "year", "url"],
  newspaper: ["author", "title", "year", "journal", "pages", "url"],
  "senate-report-us": ["author", "title", "year", "publisher", "place"],
  bill: ["title", "year", "publisher", "place", "url"],
  act: ["title", "year", "publisher", "place", "url"]
};

function normalize(str) {
  return str.toLowerCase().replace(/[‘’“”]/g, "'").replace(/[^a-z0-9]/g, "");
}

function getAllFields() {
  const fields = document.querySelectorAll("input, select");
  const result = {};
  fields.forEach(f => result[f.id] = f.value.trim());
  return result;
}

function formatReference(data, format) {
  const today = new Date();
  const accessed = today.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const A = field => data[field] || '';
  if (format === 'journal') {
    const issueText = A('issue') ? `(${A('issue')})` : '';
    return `${A('author')} ${A('year')}. ${A('title')}. <i>${A('journal')}</i>. [Online]. ${A('volume')}${issueText}, pp.${A('pages')}. [Accessed ${accessed}]. Available from: ${A('url')}`;
  }
  return `${A('author')} ${A('year')}. ${A('title')}.`;
}

async function fetchMetadata(title, format, missingFields, isbn = "") {
  const logs = [];
  let bestResult = {};

  for (const source of API_CHAINS[format]) {
    try {
      const response = await fetch(`${PROXY_BASE}/${source}?title=${encodeURIComponent(title)}`);
      const result = await response.json();
      logs.push({ source, status: "success", returnedFields: Object.keys(result || {}) });

      if (result && Object.keys(result).some(key => missingFields.includes(key) && result[key])) {
        bestResult = result;
        break;
      }
    } catch (e) {
      logs.push({ source, status: "error", error: e.message });
    }
  }

  return { data: bestResult, logs };
}

async function generateReference() {
  const format = document.getElementById("format").value;
  const data = getAllFields();
  const requiredFields = FORMAT_FIELDS[format] || [];
  const missingFields = requiredFields.filter(field => !data[field]);
  let fetchedData = {}, logs = [];

  if (!data.title) {
    alert("Please enter a title.");
    return;
  }

  if (missingFields.length > 0) {
    const result = await fetchMetadata(data.title, format, missingFields, data.isbn);
    fetchedData = result.data;
    logs = result.logs;
  }

  const finalData = { ...data };
  for (const field of missingFields) {
    if (fetchedData[field]) finalData[field] = fetchedData[field];
  }

  const debugData = {
    missingFields,
    fetchedData,
    logs
  };

  document.getElementById("debugOutput").value = JSON.stringify(debugData, null, 2);
  const ref = formatReference(finalData, format);
  document.getElementById("finalOutput").innerText = ref;
}