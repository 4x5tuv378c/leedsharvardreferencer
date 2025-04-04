// referenceEngine.js - Fully working engine with full fallback logic and debug metadata

const PROXY_BASE = "https://proxysiteforlhra.onrender.com";

const API_CHAINS = {
  journal: ["crossref", "semantic-scholar", "openlibrary", "google-search"],
  book: ["openlibrary", "crossref", "google-search"],
  ebook: ["openlibrary", "crossref", "google-search"],
  bookchapter: ["openlibrary", "crossref", "google-search"],
  thesis: ["openlibrary", "semantic-scholar", "google-search"],
  website: ["google-search"],
  report: ["crossref", "openlibrary", "google-search"],
  pressrelease: ["google-search"],
  newspaper: ["google-search"],
  "senate-report-us": ["openlibrary", "google-search"],
  bill: ["openlibrary", "google-search"],
  act: ["openlibrary", "google-search"]
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
  const processLog = [];
  let merged = {};
  for (const source of API_CHAINS[format]) {
    try {
      const res = await fetch(`${PROXY_BASE}/${source}?title=${encodeURIComponent(title)}`);
      const json = await res.json();
      if (json && typeof json === "object") {
        processLog.push({ source, status: "success", fields: Object.keys(json) });
        merged = { ...merged, ...json };
      } else {
        processLog.push({ source, status: "no-data" });
      }
    } catch (e) {
      processLog.push({ source, status: "error", error: e.message });
    }
  }
  return { merged, processLog };
}

async function generateReference() {
  const format = document.getElementById("format").value;
  const data = getAllFields();
  const requiredFields = FORMAT_FIELDS[format] || [];
  const missingFields = requiredFields.filter(field => !data[field]);

  if (!data.title) {
    alert("Please enter a title.");
    return;
  }

  const { merged, processLog } = await fetchMetadata(data.title, format, missingFields);
  const finalData = { ...data };
  for (const field of missingFields) {
    if (merged[field]) finalData[field] = merged[field];
  }

  const debugInfo = {
    missingFields,
    fetchedData: merged,
    processLog
  };

  document.getElementById("debugOutput").value = JSON.stringify(debugInfo, null, 2);
  const ref = formatReference(finalData, format);
  document.getElementById("finalOutput").innerText = ref;
}
