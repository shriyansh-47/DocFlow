// In-memory document store (replaces a database for the base prototype)

const documents = [];

module.exports = {
  documents,

  addDocument(doc) {
    documents.push(doc);
    return doc;
  },

  getAll() {
    return documents;
  },

  getById(id) {
    return documents.find((d) => d.id === id);
  },

  updateDocument(id, updates) {
    const idx = documents.findIndex((d) => d.id === id);
    if (idx === -1) return null;
    documents[idx] = { ...documents[idx], ...updates };
    return documents[idx];
  },
};
