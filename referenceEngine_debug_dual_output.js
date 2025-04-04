
// referenceEngine_debug_logs.js – With JSON + Human-Readable Debug

const PROXY_BASE = "https://proxysiteforlhra.onrender.com";

const API_CHAINS = {
  journal: ["crossref", "semantic-scholar", "open-library", "google-search"],
  book: ["crossref", "open-library", "google-books", "google-search"],
  ebook: ["crossref", "open-library", "google-books", "google-search"],
  bookchapter: ["crossref", "open-library", "google-books", "google-search"],
  thesis: ["open-library", "semantic-scholar", "google-search"],
  website: ["microlink", "google-search"],
  report: ["crossref", "semantic-scholar", "google-search"],
  pressrelease: ["newsapi", "google-search"],
  newspaper: ["newsapi", "google-search"],
  "senate-report-us": ["govinfo", "semantic-scholar", "google-search"],
  bill: ["govinfo", "semantic-scholar", "google-search"],
  act: ["govinfo", "semantic-scholar", "google-search"]
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

async function fetchMetadata(title, format, missingFields) {
  const log = [];
  let finalData = {};

  for (const source of API_CHAINS[format]) {
    const url = `${PROXY_BASE}/${source}?title=${encodeURIComponent(title)}`;
    try {
      const response = await fetch(url);
      const result = await response.json();
      if (result && typeof result === "object") {
        const fieldsReturned = Object.keys(result).filter(k => result[k]);
        log.push({ source, status: "success", fieldsReturned });
        if (fieldsReturned.length > 1) {
          finalData = result;
          break;
        }
      } else {
        log.push({ source, status: "empty response", raw: result });
      }
    } catch (e) {
      log.push({ source, status: "error", error: e.message });
    }
  }

  const humanSummary = log.map(entry => {
    if (entry.status === "success") {
      return `• ✅ ${entry.source}: Success – Fields: ${entry.fieldsReturned.join(", ")}`;
    } else if (entry.status === "empty response") {
      return `• ⚠️ ${entry.source}: No usable metadata`;
    } else {
      return `• ❌ ${entry.source}: Error – ${entry.error}`;
    }
  }).join("\n");

  return { finalData, debugLog: log, humanSummary };
}

async function generateReference() {
  const format = document.getElementById("format").value;
  const data = getAllFields();
  const requiredFields = FORMAT_FIELDS[format] || [];
  const missingFields = requiredFields.filter(field => !data[field]);
  let fetchedData = {};
  let debugLog = [];
  let humanSummary = "";

  if (!data.title) {
    alert("Please enter a title.");
    return;
  }

  if (missingFields.length > 0) {
    const metadataResult = await fetchMetadata(data.title, format, missingFields);
    fetchedData = metadataResult.finalData;
    debugLog = metadataResult.debugLog;
    humanSummary = metadataResult.humanSummary;
  }

  const finalData = { ...data };
  for (const field of missingFields) {
    if (fetchedData[field]) finalData[field] = fetchedData[field];
  }

  const debugOutput = {
    missingFields,
    fetchedData,
    process: debugLog
  };

  document.getElementById("debugOutput").value = `--- JSON Debug Log ---\n${JSON.stringify(debugOutput, null, 2)}\n\n--- Human Summary ---\n${humanSummary}`;
  const ref = formatReference(finalData, format);
  document.getElementById("finalOutput").innerText = ref;
}
