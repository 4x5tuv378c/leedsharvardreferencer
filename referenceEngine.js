
// referenceEngine.js — Fully rebuilt and corrected

const PROXY_BASE = "https://proxysiteforlhra.onrender.com";

// --- Field maps per format ---
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

function getAllFields() {
  const data = {};
  Object.keys(FORMAT_FIELDS).flatMap(k => FORMAT_FIELDS[k]).forEach(id => {
    const el = document.getElementById(id);
    if (el) data[id] = el.value.trim();
  });
  return data;
}

function normalize(str) {
  return str.toLowerCase().replace(/[\u2018\u2019\u201C\u201D]/g, "'").replace(/[^a-z0-9]/g, "");
}

function showFieldsForFormat(format) {
  const all = document.querySelectorAll(".field-group");
  all.forEach(row => row.style.display = "none");
  (FORMAT_FIELDS[format] || []).forEach(field => {
    const row = document.getElementById(field + "Row");
    if (row) row.style.display = "block";
  });
}

async function fetchMetadata(title, format, fieldsNeeded, isbn = "") {
  const url = `${PROXY_BASE}/google-search?title=${encodeURIComponent(title)}`;
  try {
    const res = await fetch(url);
    const json = await res.json();
    const items = json.items || [];
    const best = items[0];
    return {
      title: best?.title || title,
      url: best?.link || ""
    };
  } catch (err) {
    console.warn("API fetch failed:", err);
    return {};
  }
}

function formatReference(data, format) {
  const A = k => data[k] || "";
  const accessed = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  if (format === "journal") {
    if (/^\d{5,}$/.test(A("pages"))) {
      return `${A("author")} ${A("year")}. ${A("title")}. <i>${A("journal")}</i>. [Online]. ${A("volume")}, article no: ${A("pages")} [no pagination]. [Accessed ${accessed}]. Available from: ${A("url")}`;
    }
    return `${A("author")} ${A("year")}. ${A("title")}. <i>${A("journal")}</i>. [Online]. ${A("volume")}${A("issue") ? `(${A("issue")})` : ""}, pp.${A("pages")}. [Accessed ${accessed}]. Available from: ${A("url")}`;
  }

  if (format === "book") {
    return `${A("author")} ${A("year")}. <i>${A("title")}</i>. ${A("place")}: ${A("publisher")}.`;
  }

  if (format === "ebook") {
    return `${A("author")} ${A("year")}. <i>${A("title")}</i>. [Online]. ${A("place")}: ${A("publisher")}. [Accessed ${accessed}]. Available from: ${A("url")}`;
  }

  if (format === "bookchapter") {
    return `${A("author")} ${A("year")}. ${A("title")}. In: ${A("editors")}, ed. <i>${A("bookTitle")}</i>. ${A("place")}: ${A("publisher")}, pp.${A("pages")}.`;
  }

  if (format === "thesis") {
    return `${A("author")} ${A("year")}. <i>${A("title")}</i>. Thesis. ${A("place")}: ${A("publisher")}.`;
  }

  if (format === "website") {
    return `${A("author")} ${A("year")}. <i>${A("title")}</i>. [Online]. [Accessed ${accessed}]. Available from: ${A("url")}`;
  }

  if (format === "report") {
    return `${A("author")} ${A("year")}. <i>${A("title")}</i>. ${A("place")}: ${A("publisher")}.`;
  }

  if (format === "pressrelease") {
    return `${A("author")} ${A("year")}. <i>${A("title")}</i>. [Press release]. [Accessed ${accessed}]. Available from: ${A("url")}`;
  }

  if (format === "newspaper") {
    return `${A("author")} ${A("year")}. ${A("title")}. <i>${A("journal")}</i>. [Online]. [Accessed ${accessed}]. Available from: ${A("url")}`;
  }

  if (format === "senate-report-us") {
    return `${A("author")} ${A("year")}. <i>${A("title")}</i>. ${A("place")}: ${A("publisher")}.`;
  }

  if (format === "bill") {
    return `${A("title")} ${A("year")}. [Online]. ${A("place")}: ${A("publisher")}. [Accessed ${accessed}]. Available from: ${A("url")}`;
  }

  if (format === "act") {
    return `${A("title")} ${A("year")}. [Online]. ${A("place")}: ${A("publisher")}. [Accessed ${accessed}]. Available from: ${A("url")}`;
  }

  return `${A("author")} ${A("year")}. <i>${A("title")}</i>. ${A("place")}: ${A("publisher")}.`;
}

async function generateReference() {
  const format = document.getElementById("format").value;
  const data = getAllFields();
  const required = FORMAT_FIELDS[format] || [];
  const missing = required.filter(f => !data[f]);
  if (!data.title) {
    alert("Please enter a title.");
    return;
  }
  let fetched = {};
  if (missing.length > 0) {
    fetched = await fetchMetadata(data.title, format, missing);
  }
  const finalData = { ...data, ...fetched };
  document.getElementById("debugOutput").value = JSON.stringify({ missingFields: missing, fetchedData: fetched }, null, 2);
  document.getElementById("finalOutput").innerText = formatReference(finalData, format);
}
