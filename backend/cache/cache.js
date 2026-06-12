let occCache = {
  updatedAt: null,
  cards: []
};

function getCache() {
  return occCache;
}

function setCache(data) {
  occCache = data;
}

module.exports = { getCache, setCache };
