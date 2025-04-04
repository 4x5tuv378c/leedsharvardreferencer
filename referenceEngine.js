
// referenceEngine.js — now with CSV/txt batch import support

function parseUploadedFile(file, callback) {
  const reader = new FileReader();
  reader.onload = function (e) {
    const lines = e.target.result.split(/\r?\n/).filter(Boolean);
    const batchList = lines.map(line => {
      const [title, format] = line.split(',').map(x => x.trim());
      return { title, format: format || 'book' };
    });
    callback(batchList);
  };
  reader.readAsText(file);
}

function handleFileInputChange(event) {
  const file = event.target.files[0];
  if (file) {
    parseUploadedFile(file, (batchList) => {
      generateBatchReferences(batchList);
    });
  }
}
