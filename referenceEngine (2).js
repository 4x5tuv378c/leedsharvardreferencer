// referenceEngine.js - Fully upgraded, proxy-only, debug-enabled engine

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

const API_CHAIN = {
  journal: ["crossref", "semantic-scholar", "open-library", "google-search"],
  book: ["open-library", "crossref", "google-search"],
  ebook: ["open-library", "crossref", "google-search"],
  bookchapter: ["open-library", "crossref", "google-search"],
  thesis: ["open-library", "crossref", "google-search"],
  website: ["google-search", "crossref", "open-library"],
  report: ["crossref", "google-search"],
  pressrelease: ["google-search"],
  newspaper: ["google-search", "crossref"],
  "senate-report-us": ["google-search"],
  bill: ["google-search"],
  act: ["google-search"]
};

function renderInputFields() {
  const format = document.getElementById("format").value;
  const container = document.getElementById("inputFields");
  container.innerHTML = "";
  const fields = FORMAT_FIELDS[format] || [];
  fields.forEach(field => {
    const label = document.createElement("label");
    label.for = field;
    label.textContent = field.charAt(0).toUpperCase() + field.slice(1) + ":";
    const input = document.createElement("input");
    input.id = field;
    input.style.width = "100%";
    container.appendChild(label);
    container.appendChild(input);
    container.appendChild(document.createElement("br"));
    container.appendChild(document.createElement("br"));
  });
}

async function fetchMetadata(title, format) {
  const PROXY = "https://proxysiteforlhra.onrender.com";
  const allData = {};
  const log = [];

  for (const api of API_CHAIN[format] || []) {
    try {
      const res = await fetch(`${PROXY}/${api}?title=${encodeURIComponent(title)}`);
      const json = await res.json();
      log.push({ api, success: true, data: json });
      Object.assign(allData, json);
    } catch (e) {
      log.push({ api, success: false, error: e.message });
    }
  }

  return { combined: allData, log };
}

function formatReference(data, format) {
  const today = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const A = f => data[f] || "";
  if (format === "journal") {
    const issue = A("issue") ? `(${A("issue")})` : "";
    return `${A("author")} ${A("year")}. ${A("title")}. <i>${A("journal")}</i>. [Online]. ${A("volume")}${issue}, pp.${A("pages")}. [Accessed ${today}]. Available from: ${A("url")}`;
  }
  return `${A("author")} ${A("year")}. ${A("title")}.`;
}

async function generateReference() {
  const format = document.getElementById("format").value;
  const inputs = FORMAT_FIELDS[format] || [];
  const userData = {};
  inputs.forEach(f => {
    const el = document.getElementById(f);
    if (el) userData[f] = el.value.trim();
  });

  const missing = inputs.filter(f => !userData[f]);
  if (!userData.title) {
    alert("Please enter a title.");
    return;
  }

  const { combined, log } = await fetchMetadata(userData.title, format);
  missing.forEach(f => {
    if (combined[f]) userData[f] = combined[f];
  });

  const debug = {
    missingFields: missing,
    fetchedData: combined,
    apiLog: log
  };
  document.getElementById("debugOutput").value = JSON.stringify(debug, null, 2);
  document.getElementById("finalOutput").innerText = formatReference(userData, format);
}
