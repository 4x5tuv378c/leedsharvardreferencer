
// uiRenderer.js — handles dynamic UI field rendering and hints
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
  "congress-hearing-us": ["author", "title", "year", "publisher", "place"],
  bill: ["title", "year", "publisher", "place", "url"],
  act: ["title", "year", "publisher", "place", "url"]
};

function insertPlaceholderHints(fields) {
  const container = document.getElementById("inputFields");
  fields.forEach(field => {
    const input = document.getElementById(field);
    if (input) {
      let placeholderText = "";
      switch (field) {
        case "author": placeholderText = "e.g., Smith, J."; break;
        case "title": placeholderText = "e.g., Understanding Economics"; break;
        case "journal": placeholderText = "e.g., Journal of Business"; break;
        case "bookTitle": placeholderText = "e.g., Advances in Science"; break;
        case "editors": placeholderText = "e.g., Brown, L. and Davis, P."; break;
        case "publisher": placeholderText = "e.g., Oxford University Press"; break;
        case "place": placeholderText = "e.g., London"; break;
        case "pages": placeholderText = "e.g., 23-45 or Article 2201"; break;
        case "volume": placeholderText = "e.g., 12"; break;
        case "issue": placeholderText = "e.g., 4"; break;
        case "year": placeholderText = "e.g., 2023"; break;
        case "url": placeholderText = "e.g., https://example.com/page"; break;
      }
      input.placeholder = placeholderText;
    }
  });
}
